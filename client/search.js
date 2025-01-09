// api/search.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const query = req.query.q;
    let results = [];

    if (process.env.NEXT_PUBLIC_USE_MOCK_SEARCH === 'true') { // 使用环境变量控制
      // 模拟搜索
      if (query) {
        for (let i = 0; i < 5; i++) {
          results.push({ title: `模拟搜索结果${i}：${query}`, url: `/result/${i}` });
        }
      }
    } else {
      // 调用真实后端 API
      try {
        const response = await fetch(`/api/real-search?q=${query}`); // 假设你的真实 API 路由是 /api/real-search
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        results = await response.json();
      } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ error: "Failed to fetch search results" }); // 返回错误信息
        return; // 必须返回，防止后续代码继续执行
      }
    }

    res.status(200).json(results);
  } else {
    res.status(405).end();
  }
}
