# Enterprise User Management

👥 Enterprise licenses support multiple users under a single organization. A **Company Admin** can invite users to the platform, assign them to license seats, and reassign seats at any time. Non-admin users have read-only access to license information.

---

## Understanding License Seats

An enterprise license has a fixed number of **seats** — the number of users who can be actively assigned to it at one time. Your organization can have more total platform users than available seats.

**Example:** Your organization has 5 registered users but a 3-seat license. As an admin, you can freely choose which 3 of those 5 users are assigned to the license at any given time. You can swap assignments at any point — no data is lost when a user is removed from a seat and re-added later.

This flexibility is useful for:
- Teams with rotating access needs (e.g., project-based usage)
- Organizations that need to share a license across departments
- Onboarding new team members before deciding on seat allocation

---

## Viewing Your License

Go to your **profile avatar** in the top-right corner to open the Profile panel.

![](.../.gitbook/assets/profile-light.png)

Select the **License Information** tab to see your active license, assigned users, and available seats.

![](.../.gitbook/assets/profile-license-light.png)

The license card shows:
- License name and software (e.g., QSARFlex)
- Coverage type (individual / enterprise)
- Billing model (subscription / pay-per-test / on-demand)
- Status (active / inactive / expired)
- Start and end dates (for subscriptions)
- Remaining tests (for pay-per-test licenses)
- Currently assigned users

---

## Assigning & Removing Users from a License

Only users with the **Company Admin** role can modify seat assignments.

1. Go to **Profile → License Information**.
2. In the **Active License** section, click **Update users**.

![](.../.gitbook/assets/profile-license-assign-users-light.png)

3. The dialog shows all platform users in your organization and which ones are currently assigned.
4. Add or remove users from the license as needed.
5. Click **Save** to apply the changes.

Users removed from the license lose access to the licensed modules immediately. Users added gain access immediately.

> 💡 You can reassign seats as often as needed — there is no cooldown or limit on reassignments.

---

## Inviting a New User to the Platform

Adding a new person to your organization requires two steps: first invite them to the platform, then assign them to a license.

### Step 1 — Send the Invitation

1. Go to **Profile → License Information**.
2. Click **Invite user**.

![](.../.gitbook/assets/profile-invite-user-light.png)

3. Enter the user's email address and click **Send Invitation**.

![](.../.gitbook/assets/profile-users-invite-dialog-light.png)

The user receives an automated setup email with a link to create their MultiCASE account. Once they complete registration, their account appears in your organization's user list.

### Step 2 — Assign to a License

After the user accepts the invitation and creates their account:

1. Go to **Profile → License Information** → **Update users**.
2. Select the new user from the list and click **Save**.

The user now has access to all modules included in that license.

---

## Managing Platform Users

Go to **Profile → Users** to see all users in your organization.

![](.../.gitbook/assets/profile-users-light.png)

The Users tab shows:
- Each user's name and email
- Their role (Company Admin or standard user)
- Whether they currently have an active license assignment

From this tab, admins can also invite new users directly using the **Invite user** button.

---

## Notes

- Only users with the **Company Admin** role can manage users and license assignments.
- A user must accept their invitation and create an account before they can be assigned to a license.
- Each license seat can be assigned to one user at a time, but you can freely swap who occupies each seat.
- To change your license capacity (add or remove seats), contact [support@multicase.com](mailto:support@multicase.com).
- To promote a user to Company Admin or change roles, contact [support@multicase.com](mailto:support@multicase.com).
