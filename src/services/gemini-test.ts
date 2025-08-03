import { geminiService } from './gemini';

/**
 * Test koneksi Gemini AI
 */
export const testGeminiConnection = async () => {
  try {
    console.log('🤖 Testing Gemini AI connection...');
    
    // Test dengan data sederhana
    const testData = {
      transactions: [
        {
          id: 'test-1',
          total: 50000,
          createdAt: new Date()
        }
      ],
      products: [
        {
          name: 'Test Product',
          price: 25000,
          stock: 10
        }
      ]
    };
    
    const result = await geminiService.analyzeSalesData(
      testData.transactions,
      testData.products
    );
    
    console.log('✅ Gemini AI connection successful');
    console.log('📊 Test analysis result:', result);
    
    return true;
  } catch (error) {
    console.error('❌ Gemini AI connection failed:', error);
    // Don't throw error, just return false
    return false;
  }
};

/**
 * Test semua fitur Gemini AI
 */
export const testAllGeminiFeatures = async () => {
  console.log('🧪 Testing all Gemini AI features...');
  
  const testData = {
    transactions: [
      {
        id: 'test-1',
        total: 50000,
        createdAt: new Date()
      }
    ],
    products: [
      {
        name: 'Test Product',
        price: 25000,
        stock: 10,
        category: 'Test'
      }
    ],
    customers: [
      {
        name: 'Test Customer',
        email: 'test@example.com'
      }
    ]
  };
  
  try {
    // Test sales analysis
    console.log('📊 Testing sales analysis...');
    const salesAnalysis = await geminiService.analyzeSalesData(
      testData.transactions,
      testData.products
    );
    console.log('✅ Sales analysis:', salesAnalysis);
    
    // Test category recommendations
    console.log('🏷️ Testing category recommendations...');
    const categoryRecs = await geminiService.recommendProductCategories(
      testData.products,
      testData.transactions
    );
    console.log('✅ Category recommendations:', categoryRecs);
    
    // Test customer behavior analysis
    console.log('👥 Testing customer behavior analysis...');
    const customerAnalysis = await geminiService.analyzeCustomerBehavior(
      testData.customers,
      testData.transactions
    );
    console.log('✅ Customer analysis:', customerAnalysis);
    
    // Test sales prediction
    console.log('🔮 Testing sales prediction...');
    const salesPrediction = await geminiService.predictSales(
      testData.transactions,
      testData.products
    );
    console.log('✅ Sales prediction:', salesPrediction);
    
    // Test inventory optimization
    console.log('📦 Testing inventory optimization...');
    const inventoryOpt = await geminiService.optimizeInventory(
      testData.products,
      testData.transactions
    );
    console.log('✅ Inventory optimization:', inventoryOpt);
    
    console.log('🎉 All Gemini AI features tested successfully!');
    return true;
  } catch (error) {
    console.error('❌ Gemini AI feature test failed:', error);
    // Don't throw error, just return false
    return false;
  }
}; 