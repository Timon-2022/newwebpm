const axios = require('axios');

module.exports = async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: '消息不能为空' });
        }

        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的商业模式顾问，擅长分析商业模式、提供优化建议。请用简洁、专业的方式回答用户的问题。"
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer sk-218fb5c097224b4dbc8a4552a91a83ab`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            reply: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error('API 调用错误:', error);
        res.status(500).json({
            error: '服务器错误',
            details: error.message
        });
    }
}; 