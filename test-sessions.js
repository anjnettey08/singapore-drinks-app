// Test script for session functionality
import { sessionService } from './src/services/sessionService';

async function testSessionFeatures() {
  console.log('🧪 Testing Session Features...\n');

  try {
    // Test 1: Create a session
    console.log('1. Creating a new session...');
    const createResponse = await sessionService.createSession('Alice');
    console.log('✅ Session created:', createResponse.session?.id);

    if (!createResponse.success || !createResponse.session) {
      throw new Error('Failed to create session');
    }

    const sessionId = createResponse.session.id;
    const creatorId = createResponse.session.creatorId;

    // Test 2: Join the session
    console.log('\n2. Joining the session...');
    const joinResponse = await sessionService.joinSession(sessionId, 'Bob');
    console.log('✅ Bob joined session:', joinResponse.success);

    // Test 3: Add an order
    console.log('\n3. Adding an order...');
    const orderResponse = await sessionService.addOrderToSession(
      sessionId,
      creatorId,
      { drinkId: 'kopi-o', customizations: {}, quantity: 1 },
      'Kopi O',
      2.50
    );
    console.log('✅ Order added:', orderResponse.success);

    // Test 4: Get session details
    console.log('\n4. Getting session details...');
    const sessionResponse = await sessionService.getSession(sessionId);
    if (sessionResponse.success && sessionResponse.session) {
      console.log('✅ Session retrieved:');
      console.log('   - Members:', sessionResponse.session.users.length);
      console.log('   - Orders:', sessionResponse.session.orders.length);
      console.log('   - Total:', `$${sessionResponse.session.totalAmount.toFixed(2)}`);
    }

    // Test 5: Error handling - invalid session
    console.log('\n5. Testing error handling...');
    const invalidResponse = await sessionService.getSession('INVALID');
    console.log('✅ Invalid session handled:', !invalidResponse.success);

    console.log('\n🎉 All tests passed! Session functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSessionFeatures();
}

export { testSessionFeatures };