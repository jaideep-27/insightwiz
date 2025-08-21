const mongoose = require('mongoose');
const User = require('./backend/models/User');
const UserAnalytics = require('./backend/models/UserAnalytics');

async function debugUserData() {
  try {
    await mongoose.connect('mongodb://localhost/insightwiz');
    
    console.log('🔍 Checking User Data...');
    const user = await User.findOne({ email: 'test@insightwiz.com' });
    console.log('User ID:', user?._id);
    console.log('Total Analyses:', user?.academicData?.performanceMetrics?.totalAnalyses);
    console.log('Uploaded Files Count:', user?.academicData?.uploadedFiles?.length);
    
    console.log('\n🔍 Checking UserAnalytics Data...');
    const userAnalytics = await UserAnalytics.findOne({ userId: user._id });
    console.log('UserAnalytics exists:', !!userAnalytics);
    console.log('Analyses count:', userAnalytics?.analyses?.length || 0);
    console.log('Activity stats:', userAnalytics?.activityStats);
    
    if (userAnalytics?.analyses?.length > 0) {
      console.log('\n📊 Recent Analyses:');
      userAnalytics.analyses.slice(0, 3).forEach((analysis, index) => {
        console.log(`${index + 1}. ${analysis.fileName} - ${analysis.status} - ${analysis.processedAt}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugUserData();
