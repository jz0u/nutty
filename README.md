## Nutty

Express + MongoDB app.

### Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` in the project root with:
   ```
   PORT=3000
   mongodb_uri=your_mongodb_uri
   ACCESS_TOKEN_SECRET=replace_with_random_string
   REFRESH_TOKEN_SECRET=replace_with_random_string
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Project structure

```
config/        # environment and configuration
controllers/   # request handlers
middleware/    # auth and error handlers
models/        # mongoose schemas/models
routes/        # route definitions and index
public/        # static files and pages
app.js         # app bootstrap
```


