#!/usr/bin/env node

/**
 * Debug script for Render deployment
 * Run this in Render Shell to diagnose issues
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking database connection...');
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const result = await prisma.$queryRaw`SELECT current_database(), version()`;
    console.log('📊 Database info:', result);

    // Count records in main tables
    const users = await prisma.user.count();
    const exercises = await prisma.exercise.count();
    console.log(`📈 Stats: ${users} users, ${exercises} exercises`);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
  }
}

async function checkEnvironment() {
  console.log('\n🌍 Environment Check:');
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'CORS_ORIGIN'
  ];

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const display = value ? (varName.includes('SECRET') ? '***' : value.substring(0, 50)) : 'NOT SET';
    console.log(`${status} ${varName}: ${display}`);
  });
}

async function testEndpoints() {
  console.log('\n🔗 Testing Endpoints:');
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 3001}`;

  try {
    // Test health endpoint
    const healthUrl = `${baseUrl}/health`;
    console.log(`Testing ${healthUrl}...`);

    // Note: fetch might not be available in older Node versions
    if (typeof fetch !== 'undefined') {
      const response = await fetch(healthUrl);
      console.log(`Health check: ${response.status} ${response.statusText}`);
    } else {
      console.log('Fetch not available - check endpoints manually');
    }
  } catch (error) {
    console.log('⚠️ Could not test endpoints:', error.message);
  }
}

async function main() {
  console.log('🚀 Render Debug Script\n' + '='.repeat(40));

  await checkEnvironment();
  await checkDatabase();
  await testEndpoints();

  console.log('\n' + '='.repeat(40));
  console.log('✨ Debug complete');

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});