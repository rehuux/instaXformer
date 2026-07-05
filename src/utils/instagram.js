const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const path = require('path');

console.log('🔧 Insta Former Username Remover');
console.log('👤 Credit: Syed Rehan');
console.log('📌 Dev: @rehuux (GitHub)');

// ============== GET SESSION ID FROM USERNAME/PASSWORD ==============

async function getSessionIdFromLogin(username, password) {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    try {
        // Login
        const loggedInUser = await ig.account.login(username, password);
        console.log(`✅ Logged in as: ${loggedInUser.username}`);

        // Extract session ID from cookies
        const cookies = ig.state.cookies;
        const sessionId = cookies.find(cookie => cookie.key === 'sessionid')?.value;

        if (!sessionId) {
            throw new Error('Failed to extract session ID after login');
        }

        return {
            sessionid: sessionId,
            user_id: loggedInUser.pk,
            username: loggedInUser.username
        };

    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
}

// ============== LOGIN WITH SESSION ID ==============

async function loginWithSession(sessionId) {
    const ig = new IgApiClient();
    ig.state.generateDevice('');

    try {
        // Load session from cookies
        const sessionCookie = {
            key: 'sessionid',
            value: sessionId,
            domain: '.instagram.com'
        };
        ig.state.cookies.push(sessionCookie);

        // Get user ID from session
        const userInfo = await ig.user.info(ig.state.cookieUserId);
        console.log(`✅ Logged in with session: ${userInfo.username}`);
        return ig;
    } catch (error) {
        throw new Error(`Failed to login with session ID: ${error.message}`);
    }
}

// ============== CHANGE PROFILE PICTURE ==============

async function changeInstagramPfp(ig, imagePath) {
    try {
        // Read image file
        const imageBuffer = fs.readFileSync(imagePath);
        
        // Upload profile picture
        await ig.account.changeProfilePicture(imageBuffer);
        return true;
    } catch (error) {
        throw new Error(`Failed to change profile picture: ${error.message}`);
    }
}

// ============== GET SESSION ID ONLY ==============

async function getSessionIdOnly(username, password) {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    try {
        await ig.account.login(username, password);
        const cookies = ig.state.cookies;
        const sessionId = cookies.find(cookie => cookie.key === 'sessionid')?.value;

        if (!sessionId) {
            throw new Error('Failed to extract session ID');
        }

        return sessionId;
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
}

module.exports = {
    loginWithSession,
    changeInstagramPfp,
    getSessionIdFromLogin,
    getSessionIdOnly
};
