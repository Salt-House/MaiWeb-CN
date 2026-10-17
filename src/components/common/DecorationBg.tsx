/**
 * DecorationBg - 复刻 maimai でらっくす MAGiCAL 官网 maiDecorationBg 组件
 *
 * 官方模板 (lib/site.js):
 *   <div class=maiDecorationBg>
 *     <div class=background-layer>
 *       front / staff_01 / island_01 / note_01 / staff_02 / staff_03
 *       note_02 / island_02 / sea / castle / croud_01 / croud_02 / croud_03
 *     </div>
 *   </div>
 *
 * 素材镜像于 public/assets/maiDecorationBg/（结构对齐官方 /assets/maiDecorationBg/）
 * 样式复刻自官方 lib/site.css，断点 600px 切换 pc/sp 双端素材。
 */
import "@/styles/decoration-bg.css"

export default function DecorationBg() {
  return (
    <div className="maiDecorationBg" aria-hidden="true">
      <div className="background-layer">
        <div className="front" />
        <div className="staff_01" />
        <div className="island_01" />
        <div className="note_01" />
        <div className="staff_02" />
        <div className="staff_03" />
        <div className="note_02" />
        <div className="island_02" />
        <div className="sea" />
        <div className="castle" />
        <div className="croud_01" />
        <div className="croud_02" />
        <div className="croud_03" />
      </div>
    </div>
  )
}
