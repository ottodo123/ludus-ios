const { exec } = require('child_process');
const path = require('path');

console.log('Starting iOS simulator and app...');

// First, boot the simulator
exec('xcrun simctl boot "iPhone 16 Pro" || true', (error, stdout, stderr) => {
  if (error && !error.message.includes('Unable to boot device in current state')) {
    console.error('Error booting simulator:', error);
    return;
  }
  
  console.log('Simulator booted or already running');
  
  // Open the simulator
  exec('open -a Simulator', (error2) => {
    if (error2) {
      console.error('Error opening simulator:', error2);
      return;
    }
    
    console.log('Simulator opened');
    
    // Wait a moment for simulator to fully load
    setTimeout(() => {
      console.log('Building and running the app...');
      
      // Run the iOS app
      exec('cd /Users/ottodo/Desktop/Columbia/Ludus/LudusIOS && npx react-native run-ios --simulator="iPhone 16 Pro"', {
        timeout: 300000 // 5 minutes timeout
      }, (error3, stdout3, stderr3) => {
        if (error3) {
          console.error('Error running app:', error3);
          console.error('stderr:', stderr3);
          return;
        }
        
        console.log('App launched successfully!');
        console.log(stdout3);
        
        // Take a screenshot after the app loads
        setTimeout(() => {
          const screenshotPath = '/Users/ottodo/Desktop/Columbia/Ludus/LudusIOS/app-preview.png';
          exec(`xcrun simctl io "iPhone 16 Pro" screenshot "${screenshotPath}"`, (error4) => {
            if (error4) {
              console.error('Error taking screenshot:', error4);
              return;
            }
            console.log(`Screenshot saved to: ${screenshotPath}`);
          });
        }, 10000); // Wait 10 seconds for app to fully load
      });
    }, 3000);
  });
});