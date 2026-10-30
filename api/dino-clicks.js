const COUNTER_KEY = "portfolio-dino-clicks";

function sendJson(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(JSON.stringify(body));
}

async function redisCommand(command) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    throw new Error("Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
  }

  const response = await fetch(`${redisUrl.replace(/\/$/, "")}/${command}`, {
    headers: { Authorization: `Bearer ${redisToken}` },
  });
  if (!response.ok) throw new Error("Redis request failed.");
  const result = await response.json();
  if (result.error) throw new Error("Redis command failed.");
  return result.result;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const value = req.method === "POST"
      ? await redisCommand(`INCR/${COUNTER_KEY}`)
      : await redisCommand(`GET/${COUNTER_KEY}`);
    return sendJson(res, 200, { count: Number(value) || 0 });
  } catch (error) {
    console.error("Dinosaur community counter error:", error.message);
    return sendJson(res, 503, { error: "Community counter unavailable" });
  }
};
