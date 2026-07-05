const { Client } = require('instagrapi');
const fs = require('fs');
const path = require('path');

console.log('🔧 Insta Former Username Remover');
console.log('👤 Credit: Syed Rehan');
console.log('📌 Dev: @rehuux (GitHub)');

// ============== LOGIN WITH SESSION ID ==============

async function loginWithSession(sessionId) {
    const client = new Client();

    try {
        client.setSession({
            sessionid: sessionId
        });

        const user = await client.userInfo(client.user_id);
        console.log(`✅ Logged in as: ${user.username}`);
        return client;
    } catch (error) {
        throw new Error(`Failed to login with session ID: ${error.message}`);
    }
}

// ============== CHANGE PROFILE PICTURE ==============

async function changeInstagramPfp(client, imagePath) {
    try {
        await client.accountChangeProfilePicture(imagePath);
        return true;
    } catch (error) {
        throw new Error(`Failed to change profile picture: ${error.message}`);
    }
}

// ============== GET SESSION ID FROM USERNAME/PASSWORD ==============

async function getSessionIdFromLogin(username, password) {
    const client = new Client();
    const sessionFilePath = path.join(__dirname, '../../session.json');

    try {
        // Try to load existing session first
        if (fs.existsSync(sessionFilePath)) {
            try {
                client.load_settings(sessionFilePath);
                // Check if session is valid
                await client.get_timeline_feed();
                console.log(`✅ Session loaded from file for: ${username}`);
                
                // Extract sessionid from settings
                const settings = client.get_settings();
                const sessionid = settings.authorization_data?.sessionid || 
                                 settings.cookies?.sessionid || 
                                 client.get_session()?.sessionid;
                
                if (sessionid) {
                    return {
                        sessionid: sessionid,
                        user_id: client.user_id,
                        username: username
                    };
                }
            } catch (sessionError) {
                console.log(`⚠️ Session invalid, logging in with password: ${sessionError.message}`);
                // Remove invalid session file
                fs.unlinkSync(sessionFilePath);
            }
        }

        // Login with username and password
        console.log(`🔑 Logging in as: ${username}`);
        await client.login(username, password);
        
        // Dump session for future use
        client.dump_settings(sessionFilePath);
        console.log(`✅ Session saved to: ${sessionFilePath}`);

        // Extract sessionid
        const settings = client.get_settings();
        const sessionid = settings.authorization_data?.sessionid || 
                         settings.cookies?.sessionid || 
                         client.get_session()?.sessionid;

        if (!sessionid) {
            throw new Error('Failed to extract session ID after login');
        }

        return {
            sessionid: sessionid,
            user_id: client.user_id,
            username: username
        };

    } catch (error) {
        // Clean up on error
        if (fs.existsSync(sessionFilePath)) {
            try {
                fs.unlinkSync(sessionFilePath);
            } catch (unlinkError) {
                console.log(`⚠️ Could not remove session file: ${unlinkError.message}`);
            }
        }
        throw new Error(`Login failed: ${error.message}`);
    }
}

// ============== GET SESSION ID ONLY (Without Saving File) ==============

async function getSessionIdOnly(username, password) {
    const client = new Client();

    try {
        await client.login(username, password);
        
        // Extract sessionid from settings
        const settings = client.get_settings();
        const sessionid = settings.authorization_data?.sessionid || 
                         settings.cookies?.sessionid || 
                         client.get_session()?.sessionid;

        if (!sessionid) {
            throw new Error('Failed to extract session ID after login');
        }

        return {
            sessionid: sessionid,
            user_id: client.user_id,
            username: username
        };

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
