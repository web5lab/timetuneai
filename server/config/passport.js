const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Google OAuth Profile:', {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    });

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    });

    if (user) {
      // Update existing user
      user.googleId = profile.id;
      user.name = profile.displayName;
      user.avatar = profile.photos[0]?.value || '';
      user.provider = 'google';
      await user.updateLastLogin();
      
      console.log('✅ Existing user logged in:', user.email);
      return done(null, user);
    }

    // Create new user
    user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0]?.value || '',
      provider: 'google',
      preferences: {
        notifications: true,
        soundEnabled: true,
        theme: 'light',
        defaultReminderTime: '09:00',
        snoozeTime: 5
      },
      subscription: {
        plan: 'free',
        status: 'active'
      }
    });

    await user.save();
    console.log('✅ New user created:', user.email);
    
    return done(null, user);
  } catch (error) {
    console.error('❌ Google OAuth Error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;