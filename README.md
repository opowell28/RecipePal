# RecipePal                                                                                                                                                                                                                                                                 
A full-stack recipe management application that lets users create, organize, and discover their favorite recipes with custom tags and filtering.                                                                                                                                                                                                                                                                
**Live Demo:** [https://recipe-pal-mu.vercel.app/](https://recipe-pal-mu.vercel.app/)                                                 
                                                                                                                                      
## Features                                                                                                                           
                                                                                                                                       
 - **User Authentication** - Secure registration and login with JWT-based authentication                                               
 - **Recipe Management** - Create, view, edit, and delete your personal recipes                                                        
 - **Detailed Recipes** - Add title, description, servings, prep/cook times, instructions, and ingredients                             
 - **Tag System** - Organize recipes with custom tags for easy categorization                                                          
 - **Tag Filtering** - Filter your recipe collection by tags to quickly find what you're looking for                                   
 - **Responsive Design** - Clean, mobile-friendly interface built with Tailwind CSS                                                    
                                                                                                                                       
 ## Tech Stack                                                                                                                         
                                                                                                                                       
 ### Frontend                                                                                                                          
 - React 19 with Vite                                                                                                                  
 - React Router for navigation                                                                                                         
 - Zustand for state management                                                                                                        
 - TanStack Query for data fetching                                                                                                    
 - Axios for API requests                                                                                                              
 - Tailwind CSS for styling                                                                                                            
                                                                                                                                       
 ### Backend                                                                                                                           
 - Node.js with Express                                                                                                                
 - PostgreSQL database (hosted on Supabase)                                                                                            
 - Prisma ORM                                                                                                                          
 - JWT authentication                                                                                                                  
 - bcrypt for password hashing                                                                                                         
                                                                                                                                       
 ## Project Structure                                                                                                                  
                                                                                                                                       
 ```                                                                                                                                   
 recipe-pal/                                                                                                                           
 ├── client/                 # React frontend                                                                                          
 │   ├── src/                                                                                                                          
 │   │   ├── components/     # Reusable components                                                                                     
 │   │   ├── pages/          # Page components                                                                                         
 │   │   ├── services/       # API service functions                                                                                   
 │   │   └── store/          # Zustand state store                                                                                     
 │   └── ...                                                                                                                           
 ├── server/                 # Express backend                                                                                         
 │   ├── controllers/        # Route handlers                                                                                          
 │   ├── middleware/         # Auth middleware                                                                                         
 │   ├── routes/             # API routes                                                                                              
 │   ├── lib/                # Database client                                                                                         
 │   └── prisma/             # Database schema                                                                                         
 └── ...                                                                                                                               
 ```                                                                                                                                   
                                                                                                                                       
 ## Getting Started                                                                                                                    
                                                                                                                                       
 ### Prerequisites                                                                                                                     
                                                                                                                                       
 - Node.js (v18 or higher recommended)                                                                                                 
 - npm or yarn                                                                                                                         
 - PostgreSQL database (or a Supabase account)                                                                                         
                                                                                                                                       
 ### Installation                                                                                                                      
                                                                                                                                       
 1. Clone the repository:                                                                                                              
    ```bash                                                                                                                            
    git clone https://github.com/yourusername/recipe-pal.git                                                                           
    cd recipe-pal                                                                                                                      
    ```                                                                                                                                
                                                                                                                                       
 2. Install server dependencies:                                                                                                       
    ```bash                                                                                                                            
    cd server                                                                                                                          
    npm install                                                                                                                        
    ```                                                                                                                                
                                                                                                                                       
 3. Install client dependencies:                                                                                                       
    ```bash                                                                                                                            
    cd ../client                                                                                                                       
    npm install                                                                                                                        
    ```                                                                                                                                
                                                                                                                                       
 ### Environment Variables                                                                                                             
                                                                                                                                       
 **Server (`server/.env`):**                                                                                                           
 ```env                                                                                                                                
 PORT=3001                                                                                                                             
 DATABASE_URL=postgresql://user:password@host:port/database                                                                            
 JWT_SECRET=your-secret-key-here                                                                                                       
 ```                                                                                                                                   
                                                                                                                                       
 **Client (`client/.env`):**                                                                                                           
 ```env                                                                                                                                
 VITE_API_URL=http://localhost:3001/api                                                                                                
 ```                                                                                                                                   
                                                                                                                                       
 ### Database Setup                                                                                                                    
                                                                                                                                       
 1. Set your `DATABASE_URL` in the server `.env` file                                                                                  
 2. Generate the Prisma client:                                                                                                        
    ```bash                                                                                                                            
    cd server                                                                                                                          
    npx prisma generate                                                                                                                
    ```                                                                                                                                
 3. Push the schema to your database:                                                                                                  
    ```bash                                                                                                                            
    npx prisma db push                                                                                                                 
    ```                                                                                                                                
                                                                                                                                       
 ### Running Locally                                                                                                                   
                                                                                                                                       
 1. Start the backend server:                                                                                                          
    ```bash                                                                                                                            
    cd server                                                                                                                          
    npm run dev                                                                                                                        
    ```                                                                                                                                
                                                                                                                                       
 2. In a new terminal, start the frontend:                                                                                             
    ```bash                                                                                                                            
    cd client                                                                                                                          
    npm run dev                                                                                                                        
    ```                                                                                                                                
                                                                                                                                       
 3. Open [http://localhost:5173](http://localhost:5173) in your browser                                                                
                                                                                                                                       
 ## API Endpoints                                                                                                                      
                                                                                                                                       
 ### Authentication                                                                                                                    
 | Method | Endpoint | Description |                                                                                                   
 |--------|----------|-------------|                                                                                                   
 | POST | `/api/auth/register` | Register a new user |                                                                                 
 | POST | `/api/auth/login` | Login user |                                                                                             
                                                                                                                                       
 ### Recipes (Protected)                                                                                                               
 | Method | Endpoint | Description |                                                                                                   
 |--------|----------|-------------|                                                                                                   
 | GET | `/api/recipes` | Get all user recipes |                                                                                       
 | GET | `/api/recipes?tag=tagname` | Filter recipes by tag |                                                                          
 | GET | `/api/recipes/tags` | Get all available tags |                                                                                
 | GET | `/api/recipes/:id` | Get a single recipe |                                                                                    
 | POST | `/api/recipes` | Create a new recipe |                                                                                       
 | PUT | `/api/recipes/:id` | Update a recipe |                                                                                        
 | DELETE | `/api/recipes/:id` | Delete a recipe |                                                                                     
                                                                                                                                       
 ## License                                                                                                                            
                                                                                                                                       
 MIT
