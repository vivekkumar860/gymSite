#!/usr/bin/env node

/**
 * Render.com Service Monitor
 * Checks the status of your Render services
 */

const RENDER_API_KEY = process.env.RENDER_API_KEY || 'rnd_AYSplfnvjpy6HQVoOzM5ByaSr5de';
const RENDER_API_BASE = 'https://api.render.com/v1';

async function fetchRenderAPI(endpoint) {
  try {
    const response = await fetch(`${RENDER_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    return null;
  }
}

async function listServices() {
  console.log('📋 Fetching Render services...\n');

  const services = await fetchRenderAPI('/services');

  if (!services) {
    console.log('❌ Could not fetch services');
    return;
  }

  services.forEach(service => {
    console.log(`Service: ${service.name}`);
    console.log(`  ID: ${service.id}`);
    console.log(`  Type: ${service.type}`);
    console.log(`  Status: ${service.suspended ? '⚠️ SUSPENDED' : '✅ ACTIVE'}`);
    console.log(`  URL: ${service.serviceDetails?.url || 'N/A'}`);
    console.log(`  Last Deploy: ${service.updatedAt}`);
    console.log('---');
  });
}

async function checkDeployments(serviceId) {
  console.log('🚀 Checking deployments...\n');

  const endpoint = serviceId
    ? `/services/${serviceId}/deploys`
    : '/deploys';

  const deploys = await fetchRenderAPI(endpoint);

  if (!deploys || !deploys.length) {
    console.log('No deployments found');
    return;
  }

  console.log('Recent Deployments:');
  deploys.slice(0, 5).forEach(deploy => {
    const status = deploy.status === 'live' ? '✅' :
                  deploy.status === 'build_failed' ? '❌' :
                  '🔄';
    console.log(`${status} ${deploy.commit?.message || 'No message'}`);
    console.log(`   Status: ${deploy.status}`);
    console.log(`   Created: ${new Date(deploy.createdAt).toLocaleString()}`);
    console.log('');
  });
}

async function getServiceLogs(serviceId) {
  console.log('📜 Fetching recent logs...\n');

  // Note: Logs endpoint might require different authentication
  const logs = await fetchRenderAPI(`/services/${serviceId}/logs`);

  if (logs) {
    console.log(logs);
  } else {
    console.log('Could not fetch logs - check Render dashboard');
  }
}

async function main() {
  console.log('🔍 Render Service Monitor\n');
  console.log('=' .repeat(50));

  await listServices();

  // You can uncomment these with a specific service ID:
  // await checkDeployments('srv-your-service-id');
  // await getServiceLogs('srv-your-service-id');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fetchRenderAPI, listServices, checkDeployments };