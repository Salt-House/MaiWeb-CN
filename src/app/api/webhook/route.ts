import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. 读取请求体
    const body = await req.json();

    // 2. 可选：验证签名（根据你使用的服务，比如爱发电可能提供 sign）
    // const signature = req.headers.get('x-signature');
    // 验证逻辑略...

    // 3. 记录或处理回调数据
    console.log('Webhook received:', body);

    // 示例：提取字段处理
    const { order_id, amount, status } = body;

    // 4. TODO: 将数据写入数据库、触发通知等
    // await db.saveDonation(order_id, amount, status);

    // 5. 返回响应
    return new Response(JSON.stringify({ message: 'Webhook received successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
