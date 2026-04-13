// Debug endpoint to check environment variables
module.exports = async (req, res) => {
  try {
    const envVars = {
      MONGO_URL_EXISTS: !!process.env.MONGO_URL,
      MONGO_URL_LENGTH: process.env.MONGO_URL?.length || 0,
      MONGO_URL_STARTS_WITH: process.env.MONGO_URL?.substring(0, 20) + '...' || 'NOT SET',
      JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
      NODE_ENV: process.env.NODE_ENV || 'development',
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => 
        key.includes('MONGO') || key.includes('JWT') || key.includes('NODE')
      )
    };
    
    res.json({
      status: 'OK',
      message: 'Environment variables debug info',
      timestamp: new Date().toISOString(),
      environment: envVars
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Debug endpoint failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
