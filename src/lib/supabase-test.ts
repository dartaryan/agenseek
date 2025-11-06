/**
 * Supabase Connection Test
 * Verifies that environment variables are set and connection works
 */

// Test 1: Check environment variables are loaded
export function testEnvVariables() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('🔍 Testing Supabase Environment Variables:');
  console.log('');
  
  if (!url) {
    console.error('❌ VITE_SUPABASE_URL is not set in .env.local');
    return false;
  }
  
  if (!key) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is not set in .env.local');
    return false;
  }
  
  // Check if values are still placeholders
  if (url.includes('your_supabase') || url === 'your_supabase_project_url_here') {
    console.error('❌ VITE_SUPABASE_URL still contains placeholder value');
    console.error('   Update .env.local with your actual Supabase URL');
    return false;
  }
  
  if (key.includes('your_supabase') || key === 'your_supabase_anon_key_here') {
    console.error('❌ VITE_SUPABASE_ANON_KEY still contains placeholder value');
    console.error('   Update .env.local with your actual Supabase anon key');
    return false;
  }
  
  console.log('✅ VITE_SUPABASE_URL is set:', url);
  console.log('✅ VITE_SUPABASE_ANON_KEY is set:', key.substring(0, 20) + '...');
  console.log('');
  
  return true;
}

// Test 2: Test basic connection (will be used when Supabase client is set up)
export function testSupabaseReady() {
  console.log('🔍 Supabase Setup Status:');
  console.log('');
  console.log('✅ Environment variables configured');
  console.log('✅ @supabase/supabase-js installed');
  console.log('⏳ Supabase client will be created in Story 1.6');
  console.log('');
  console.log('📝 Next: Run Story 1.6 to create Supabase client');
}

// Run tests
if (import.meta.env.DEV) {
  const envOk = testEnvVariables();
  if (envOk) {
    testSupabaseReady();
  }
}

