export default function StarMove({ count = 5 }) {
  // 生成均匀分布的水平位置
  const generateEvenlyDistributedPositions = (count: number) => {
    const step = 100 / count; // 将屏幕宽度按元素数量等分 (百分比)
    return Array.from({ length: count }).map((_, index) => {
      const base = index * step; // 每个区间的起点
      const randomOffset = Math.random() * step * 0.8; // 在区间内偏移 (80% 范围)
      return base + randomOffset; // 确保值分布在 [base, base + step*0.8]
    });
  };

  const positions = generateEvenlyDistributedPositions(count);

  return (
    <>
      {positions.map((startLeft, index) => {
        const startTop = Math.random() * 5; // 随机起始高度 (0% ~ 5%)

        const style = {
          top: `${startTop}vh`, // 随机起始高度
          left: `${startLeft}vw`, // 均匀分布的水平位置
        };

        return (
          <div
            key={index}
            style={style}
            className="fixed w-[200px] h-[150px] bg-[url('/img/tail.png')] bg-no-repeat bg-contain z-[-2] animate-moveStar"
          ></div>
        );
      })}
    </>
  );
}