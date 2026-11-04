-- pandoc filter for the Word export (two passes).
-- Pass 1 drops the page furniture that only makes sense on a fixed A4 sheet
-- (running heads, footers, logo boxes), keeps the cover address as a marked
-- paragraph, marks the two-column regions for tools/docx-style.py, and
-- flattens the figures inside them to a column-wide image plus a caption.
-- Pass 2 flattens the remaining figures at text width.
--
-- A figure's crop (the .crop viewport and the oversized, offset img) is
-- carried into Word as a prefix on the image's alt text,
--   crop:<left>,<top>,<right>,<bottom>,<aspect>|<alt>
-- fractions of the source picture to show, and height/width of the shown
-- region; docx-style.py turns that into a real Word picture crop (srcRect).
local drop = { ["run-head"]=true, ["pg-foot"]=true, ["mclogo"]=true }
local function marker(text) return pandoc.Para({ pandoc.Str(text) }) end
local function pct(style, prop)
  local v = style:match(prop .. "%s*:%s*(-?[%d%.]+)%%")
  return v and tonumber(v) or nil
end
local function mm(style, prop)
  local v = style:match(prop .. "%s*:%s*(-?[%d%.]+)mm")
  return v and tonumber(v) or nil
end

-- colW: the width the figure's frame had in the PDF, in mm (a column or the text block)
local function flatten(width, colW)
  return function(f)
    local img, cropStyle
    pandoc.walk_block(f, {
      Div = function(d) if d.classes:includes("crop") then cropStyle = d.attributes["style"] or "" end end,
      Image = function(i) img = i end,
    })
    if not img then return nil end
    local alt = pandoc.utils.stringify(img.caption)
    local prefix = ""
    if cropStyle then
      local h = mm(cropStyle, "height") or 50
      local s = img.attributes["style"] or ""
      local w = pct(s, "width") or 100
      local l = pct(s, "left") or 0
      local t = pct(s, "top") or 0
      -- the picture is 1440x900; rendered width = w% of colW; left/top are % of the frame (colW x h)
      local imgW = colW * w / 100
      local imgH = imgW * 900 / 1440
      local x0 = (-l / 100 * colW) / imgW
      local x1 = x0 + colW / imgW
      local y0 = (-t / 100 * h) / imgH
      local y1 = y0 + h / imgH
      local clamp = function(v) return math.max(0, math.min(1, v)) end
      prefix = string.format("crop:%.4f,%.4f,%.4f,%.4f,%.4f,%s|", clamp(x0), clamp(y0), clamp(x1), clamp(y1), h / colW, width)
    else
      prefix = string.format("crop:0,0,1,1,%.4f,%s|", 900 / 1440, width)
    end
    img.attributes.style = nil
    img.attributes.width = width
    img.caption = { pandoc.Str(prefix .. alt) }
    local cap = pandoc.utils.blocks_to_inlines(f.caption.long)
    return {
      -- a paragraph holding only an image would be written as a figure table again
      pandoc.Para({ img, pandoc.Str("\u{200B}") }),
      pandoc.Div({ pandoc.Para(cap) }, pandoc.Attr("", {}, { ["custom-style"] = "Image Caption" })),
    }
  end
end

local function cell(blocks) return pandoc.Cell(blocks) end
local function simple_table(rows, header)
  local ncol = #rows[1]
  local body = pandoc.List()
  for _, r in ipairs(rows) do
    local cells = pandoc.List()
    for _, c in ipairs(r) do cells:insert(pandoc.Cell({ pandoc.Plain(c) })) end
    body:insert(pandoc.Row(cells))
  end
  local colspecs = {}
  for i = 1, ncol do colspecs[i] = { pandoc.AlignDefault, 1 / ncol } end
  local head = pandoc.TableHead(header and { pandoc.Row((function() local cs = pandoc.List(); for _, h in ipairs(header) do cs:insert(pandoc.Cell({ pandoc.Plain(h) })) end; return cs end)()) } or {})
  -- pandoc.TableBody is not a constructor in Lua; a plain table of the right shape is accepted
  return pandoc.Table(pandoc.Caption(), colspecs, head, { { attr = pandoc.Attr(), body = body, head = {}, row_head_columns = 0 } }, pandoc.TableFoot())
end
local function text_of(el) return pandoc.utils.stringify(el) end
local function children_by_class(d, cls)
  local out = pandoc.List()
  for _, b in ipairs(d.content) do if b.t == "Div" and b.classes:includes(cls) then out:insert(b) end end
  return out
end

local pass1 = {
  Meta = function(m) m.title = nil; return m end,
  Span = function(s)
    if s.classes:includes("pn") then return {} end
    if s.classes:includes("greek") then return pandoc.Span(s.content, pandoc.Attr("", {}, { ["custom-style"] = "Greek" })) end
    if s.classes:includes("link") then return pandoc.Span(s.content, pandoc.Attr("", {}, { ["custom-style"] = "Link" })) end
    if s.classes:includes("key") then return pandoc.Span(s.content, pandoc.Attr("", {}, { ["custom-style"] = "Key" })) end
    return nil
  end,
  Div = function(d)
    for _, c in ipairs(d.classes) do if drop[c] then return {} end end
    -- the brochure's five steps: five borderless cells, number in green
    if d.classes:includes("steps") then
      local cells = pandoc.List(); local n = 0
      for _, st in ipairs(d.content) do
        if st.t == "Div" then
          n = n + 1
          local h, desc
          for _, part in ipairs(st.content) do
            if part.t == "Div" and part.classes:includes("h") then h = text_of(part) end
            if part.t == "Div" and part.classes:includes("d") then desc = text_of(part) end
          end
          local blocks = pandoc.List({
            pandoc.Div({ pandoc.Plain({ pandoc.Str("⟦PAIR:RULE⟧") }) }, pandoc.Attr("", {}, { ["custom-style"] = "Pair" })),
            pandoc.Para({ pandoc.Span({ pandoc.Str(tostring(n)) }, pandoc.Attr("", {}, { ["custom-style"] = "Step Number" })) }),
            pandoc.Para({ pandoc.Strong(h or "") }),
            pandoc.Para({ pandoc.Str(desc or "") }),
          })
          cells:insert(pandoc.Cell(blocks))
        end
      end
      local specs = {}
      for i = 1, #cells do specs[i] = { pandoc.AlignDefault, 1 / #cells } end
      return pandoc.Table(pandoc.Caption(), specs, pandoc.TableHead({}),
        { { attr = pandoc.Attr(), body = { pandoc.Row(cells) }, head = {}, row_head_columns = 0 } }, pandoc.TableFoot())
    end
    -- the IT guide's "applies to" row: a three-column table
    if d.classes:includes("applies") then
      local header, row = {}, {}
      for _, a in ipairs(d.content) do
        if a.t == "Div" then
          local av, ad
          for _, part in ipairs(a.content) do
            if part.t == "Div" and part.classes:includes("av") then av = text_of(part) end
            if part.t == "Div" and part.classes:includes("ad") then ad = text_of(part) end
          end
          header[#header + 1] = { pandoc.Strong(av or "") }; row[#row + 1] = { pandoc.Str(ad or "") }
        end
      end
      return { pandoc.Para({ pandoc.Strong("Applies to") }), simple_table({ row }, header) }
    end
    -- the contents list: section number and title (Word repaginates, so no page numbers)
    if d.classes:includes("contents") then
      local rows = pandoc.List()
      pandoc.walk_block(d, { Div = function(t)
        if t.classes:includes("t") then
          local n, title
          for _, sp in ipairs(t.content[1].content or {}) do
            if sp.t == "Span" then
              if sp.classes:includes("tn") then n = text_of(sp) elseif not sp.classes:includes("tp") then title = text_of(sp) end
            end
          end
          if n then rows:insert({ n, title or "" }) end
        end
      end })
      table.sort(rows, function(x, y) return tonumber(x[1]) < tonumber(y[1]) end)
      local half = math.ceil(#rows / 2)
      local trows = pandoc.List()
      for i = 1, half do
        local l, r = rows[i], rows[i + half]
        trows:insert({ { pandoc.Str(l[1]) }, { pandoc.Str(l[2]) }, { pandoc.Str(r and r[1] or "") }, { pandoc.Str(r and r[2] or "") } })
      end
      trows[1][1] = { pandoc.Str("⟦LIST⟧"), pandoc.Str(rows[1][1]) }
      local t = simple_table(trows)
      t.colspecs = { { pandoc.AlignDefault, 0.06 }, { pandoc.AlignDefault, 0.44 }, { pandoc.AlignDefault, 0.06 }, { pandoc.AlignDefault, 0.44 } }
      return { pandoc.Header(3, "Contents"), t }
    end
    if d.classes:includes("c-h") then return pandoc.Div({ pandoc.Para(pandoc.utils.blocks_to_inlines(d.content)) }, pandoc.Attr("", {}, { ["custom-style"] = "Closing Head" })) end
    if d.classes:includes("callout") then return pandoc.Div(d.content, pandoc.Attr("", {}, { ["custom-style"] = "Callout Warn" })) end
    if d.classes:includes("callout-plain") then return pandoc.Div(d.content, pandoc.Attr("", {}, { ["custom-style"] = "Callout" })) end
    if d.classes:includes("checklist") then return pandoc.Div(d.content, pandoc.Attr("", {}, { ["custom-style"] = "Check" })) end
    if d.classes:includes("addr") then
      -- the two sides of the design's footer: a borderless two-cell table (the styler
      -- recognises it by its first words), each cell its own Address paragraph
      local cells = pandoc.List()
      for _, blk in ipairs(d.content) do
        cells:insert(pandoc.Cell({ pandoc.Div({ pandoc.Plain(pandoc.utils.blocks_to_inlines({ blk })) }, pandoc.Attr("", {}, { ["custom-style"] = "Address" })) }))
      end
      if #cells == 2 then
        local t = pandoc.Table(pandoc.Caption(), { { pandoc.AlignLeft, 0.6 }, { pandoc.AlignRight, 0.4 } }, pandoc.TableHead({}),
          { { attr = pandoc.Attr(), body = { pandoc.Row(cells) }, head = {}, row_head_columns = 0 } }, pandoc.TableFoot())
        return t
      end
      return pandoc.Div(d.content, pandoc.Attr("", {}, { ["custom-style"] = "Address" }))
    end
    if d.classes:includes("two") or d.classes:includes("closing") then
      -- side by side, as a borderless table: the two halves never snake into
      -- each other and a figure stays beside the paragraph that introduces it
      local cols = pandoc.List()
      for _, b in ipairs(d.content) do if b.t == "Div" then cols:insert(b) end end
      -- a long region, or one with figures, flows as a single column: a table row
      -- taller than a page splits unpredictably across renderers
      local has_figure, chars = false, 0
      pandoc.walk_block(d, { Figure = function() has_figure = true end, Str = function(x) chars = chars + #x.text end })
      if #cols == 2 and (has_figure or chars > 1600) and not d.classes:includes("closing") then
        local out = pandoc.List()
        for _, c in ipairs(cols) do
          for _, b in ipairs(c.content) do out:insert(pandoc.walk_block(b, { Figure = flatten("130mm", 85) })) end
        end
        return out
      end
      if #cols == 2 then
        local closing = d.classes:includes("closing")
        local cells = pandoc.List()
        local tag = closing and "⟦PAIR:CLOSE⟧" or (chars <= 1800 and "⟦PAIR:KEEP⟧" or "⟦PAIR⟧")
        for i, c in ipairs(cols) do
          local blocks = pandoc.List({ pandoc.Div({ pandoc.Plain({ pandoc.Str(tag) }) }, pandoc.Attr("", {}, { ["custom-style"] = "Pair" })) })
          for _, b in ipairs(c.content) do blocks:insert(pandoc.walk_block(b, { Figure = flatten("80mm", 85) })) end
          if closing and i == 2 then blocks = pandoc.List({ blocks[1], pandoc.Div({ pandoc.Plain(pandoc.utils.blocks_to_inlines(c.content)) }, pandoc.Attr("", {}, { ["custom-style"] = "Address Right" })) }) end
          cells:insert(pandoc.Cell(blocks))
        end
        local w1 = closing and 0.68 or 0.5
        return pandoc.Table(pandoc.Caption(), { { pandoc.AlignDefault, w1 }, { pandoc.AlignDefault, 1 - w1 } }, pandoc.TableHead({}),
          { { attr = pandoc.Attr(), body = { pandoc.Row(cells) }, head = {}, row_head_columns = 0 } }, pandoc.TableFoot())
      end
      return nil
    end
    return nil
  end,
  Header = function(h) if h.classes:includes("title") then h.level = 1 end return h end,
}
local pass2 = {
  Figure = flatten("170mm", 176),   -- the cover picture spans the text block
  CodeBlock = function(cb)
    -- one panel: a single-cell table the styler shades and gives a left rule
    local blocks = pandoc.List({ pandoc.Div({ pandoc.Plain({ pandoc.Str("⟦CODE⟧") }) }, pandoc.Attr("", {}, { ["custom-style"] = "Pair" })) })
    for line in (cb.text .. "\n"):gmatch("(.-)\n") do
      blocks:insert(pandoc.Div({ pandoc.Plain({ pandoc.Code(line) }) }, pandoc.Attr("", {}, { ["custom-style"] = "Code Line" })))
    end
    return pandoc.Table(pandoc.Caption(), { { pandoc.AlignDefault, 1 } }, pandoc.TableHead({}),
      { { attr = pandoc.Attr(), body = { pandoc.Row({ pandoc.Cell(blocks) }) }, head = {}, row_head_columns = 0 } }, pandoc.TableFoot())
  end,
  Table = function(t)
    -- the catalog's bundle rows: wrap the cell text so the styler can colour it
    for _, body in ipairs(t.bodies) do
      for _, row in ipairs(body.body) do
        if row.attr.classes:includes("bundle") then
          for _, c in ipairs(row.cells) do
            local name, note = pandoc.List(), pandoc.List()
            for _, inl in ipairs(pandoc.utils.blocks_to_inlines(c.contents)) do
              if inl.t == "Span" then note:extend(inl.content) elseif #note == 0 then name:insert(inl) else note:insert(inl) end
            end
            while #name > 0 and name[#name].t == "Space" do name:remove(#name) end
            local out = pandoc.List({ pandoc.Span(name, pandoc.Attr("", {}, { ["custom-style"] = "Bundle" })) })
            if #note > 0 then out:insert(pandoc.Space()); out:insert(pandoc.Span(note, pandoc.Attr("", {}, { ["custom-style"] = "Bundle Note" }))) end
            c.contents = { pandoc.Plain(out) }
          end
        end
      end
    end
    local specs, fixed, n_default = t.colspecs, 0, 0
    for _, cs in ipairs(specs) do
      if cs[2] == nil or cs[2] == "ColWidthDefault" or cs[2] == 0 then n_default = n_default + 1 else fixed = fixed + cs[2] end
    end
    if n_default > 0 then
      local share = math.max(0.08, (1 - fixed) / n_default)
      for i, cs in ipairs(specs) do
        if cs[2] == nil or cs[2] == "ColWidthDefault" or cs[2] == 0 then specs[i] = { cs[1], share } end
      end
      t.colspecs = specs
    end
    return t
  end,
}
return { pass1, pass2 }
