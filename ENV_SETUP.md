# Environment Variables Setup

## Supabase Configuration

This project uses Supabase for backend services and requires environment variables to be set up correctly.

### Setup Instructions

1. Copy the `.env.example` file to a new file named `.env` in the project root:

   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual Supabase credentials:

   ```
   SUPABASE_URL=https://your-actual-project-url.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   ```

3. These environment variables will be automatically loaded by the Expo configuration system.

### Important Notes

- Never commit your `.env` file to version control as it contains sensitive information.
- The `.env` file is already added to `.gitignore` to prevent accidental commits.
- If you add new environment variables, make sure to update both the `.env.example` file and the `app.json` configuration.
