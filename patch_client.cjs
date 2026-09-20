const fs = require('fs');
let content = fs.readFileSync('src/api/client.ts', 'utf8');
content = content.replace("};", "  ,\n  patch: async (endpoint: string, data: any) => {\n    const headers: any = { 'Content-Type': 'application/json' };\n    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;\n    const response = await fetch(`${BASE_URL}${endpoint}`, {\n      method: 'PATCH',\n      headers,\n      body: JSON.stringify(data)\n    });\n    if (!response.ok) throw new Error('Network error');\n    return response.json();\n  }\n};");
fs.writeFileSync('src/api/client.ts', content);
