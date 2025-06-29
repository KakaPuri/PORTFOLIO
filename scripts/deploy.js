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
      execSync('npx drizzle-kit push', { stdio: 'inherit' });
      console.log('✅ Database migrations completed');
    } catch (error) {
      console.error('❌ Database migration failed:', error.message);
      return;
    }

    // Seed database if needed
    try {
      console.log('🌱 Seeding database...');
      const { seedDatabase } = await import('../server/storage.js');
      await seedDatabase();
      console.log('✅ Database seeding completed');
    } catch (error) {
      console.error('❌ Database seeding failed:', error.message);
      return;
    }

    console.log('🎉 Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy(); 