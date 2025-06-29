import mysql from 'mysql2/promise';

const connectionConfig = {
  host: 'shortline.proxy.rlwy.net',
  port: 18911,
  user: 'root',
  password: 'fYSiJHduuWBeuNwjotZedmtHqLwZXZZN',
  database: 'railway'
};

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to database successfully!');
    
    // Show all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Raw SHOW TABLES result:', tables);
    console.log('\n📋 Tables in database:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    // Check data in each table
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      console.log(`\n📊 Data in table: ${tableName}`);
      
      const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 5`);
      if (rows.length === 0) {
        console.log('   (No data)');
      } else {
        console.log(`   Found ${rows.length} rows:`);
        rows.forEach((row, index) => {
          console.log(`   Row ${index + 1}:`, JSON.stringify(row, null, 2));
        });
      }
    }
    
    await connection.end();
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
  }
}

checkDatabase(); 