export default async function handler(req, res) {
    if (req.method === 'GET') {
        const query = req.query.q;
        let results = [];
        if (query) {
           // 模拟搜索
            for (let i = 0; i < 5; i++) {
                results.push({title:`搜索结果${i}`, url:`/result/${i}`})
            }
        }
        res.status(200).json(results);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
