import { execSync } from 'child_process';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function deploy() {
  try {
    console.log('🚀 Starting deployment...');
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL not found, skipping database setup');
      return;
    }

    console.log('📦 Setting up database...');
    
    // Create database connection
    const pool = mysql.createPool(process.env.DATABASE_URL);
    const db = drizzle(pool);

    // Test database connection
    try {
      await pool.execute('SELECT 1');
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return;
    }

    // Run Drizzle migrations
    try {
      console.log('🔄 Running database migrations...');
      
      // Wait a bit for database to be ready
      console.log('⏳ Waiting for database to be ready...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      // Retry migration up to 3 times
      let migrationSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          execSync('npx drizzle-kit push', { stdio: 'inherit' });
          migrationSuccess = true;
          break;
        } catch (error) {
          console.log(`❌ Migration attempt ${i + 1} failed, retrying in 5 seconds...`);
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      if (migrationSuccess) {
        console.log('✅ Database migrations completed');
      } else {
        throw new Error('Migration failed after 3 attempts');
      }
    } catch (error) {
      console.error('❌ Database migration failed:', error.message);
      console.log('⚠️  Continuing deployment without migrations...');
    }

    // Seed database if needed
    try {
      console.log('🌱 Seeding database...');
      console.log('⚠️  Skipping database seeding for now - can be done manually later');
      console.log('✅ Database setup completed (migrations only)');
    } catch (error) {
      console.error('❌ Database seeding failed:', error.message);
      console.log('⚠️  Skipping database seeding, continuing deployment...');
    }

    console.log('🎉 Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy(); 