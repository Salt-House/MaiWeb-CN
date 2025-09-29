'use client'

import { motion } from 'framer-motion'
import TextScroller from './TextScroller'
import { NamePlate, MaiBackGround, Icon, Trophie } from '../model'

interface RenderItemProps {
    item: NamePlate | MaiBackGround | Icon | Trophie
    type: 'icon' | 'frame' | 'plate' | 'trophy'
    openImagePreview: (item: any, type: string) => void
    GetCondition: (type: string, id: string) => void
}

const baseUrl = "https://assets2.lxns.net/maimai"

/**
 * 渲染收藏品项目组件
 * @param item - 收藏品数据
 * @param type - 收藏品类型
 * @param openImagePreview - 打开图片预览函数
 * @param GetCondition - 获取条件函数
 */
export default function RenderItem({ item, type, openImagePreview, GetCondition }: RenderItemProps) {
    let bg_trophy = ""
    
    if (type === 'trophy') {
        const trophyItem = item as Trophie
        switch (trophyItem.color) {
            case "Normal":
                bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Normal.png')]"
                break;
            case "Bronze":
                bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Bronze.png')]"
                break;
            case "Silver":
                bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Silver.png')]"
                break;
            case "Gold":
                bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Gold.png')]"
                break;
            case "Rainbow":
                bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Rainbow.png')]"
                break;
        }
    }

    switch (type) {
        case 'icon':
            return (
                <motion.div
                    key={item.collection_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative cursor-pointer bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                        openImagePreview(item, 'icon');
                        GetCondition('icon', item.collection_id);
                    }}
                >
                    <div className="aspect-square p-4 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                        <img
                            src={`${baseUrl}/${type}/${Number(item.collection_id)}.png`}
                            alt={item.name}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    </div>
                    <div className="p-3 bg-white">
                        <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                            {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                                {(item as Icon).genre}
                            </span>
                        </div>
                    </div>
                </motion.div>
            );

        case 'frame':
            return (
                <motion.div
                    key={item.collection_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative cursor-pointer bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                        openImagePreview(item, 'frame');
                        GetCondition('frame', item.collection_id);
                    }}
                >
                    <div className="aspect-[4/3] p-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                        <img
                            src={`https://static.maimai.moe/UI_Frame_${item.collection_id}.png`}
                            alt={item.name}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    </div>
                    <div className="p-3 bg-white">
                        <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                            {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                {(item as MaiBackGround).genre}
                            </span>
                        </div>
                    </div>
                </motion.div>
            );

        case 'trophy':
            return (
                <motion.div
                    key={item.collection_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`relative cursor-pointer ${bg_trophy} bg-no-repeat bg-contain w-72 mx-auto flex flex-col items-center justify-center`}
                    style={{ aspectRatio: '272/29' }}
                    onClick={() => {
                        openImagePreview(item, 'trophy');
                        GetCondition('trophy', item.collection_id);
                    }}
                >
                    <div
                        className="max-w-40 text-white text-sm font-bold"
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                    >
                        <TextScroller text={item.name} speed={10} delay={2} />
                    </div>
                </motion.div>
            );

        case 'plate':
            return (
                <motion.div
                    key={item.collection_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative cursor-pointer bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                        openImagePreview(item, 'nameplate');
                        GetCondition('plate', item.collection_id);
                    }}
                >
                    <div className="aspect-[3/1] p-4 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                        <img
                            src={`https://static.maimai.moe/UI_Plate_${item.collection_id.toString().padStart(6, '0')}.png`}
                            alt={item.name}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    </div>
                    <div className="p-3 bg-white">
                        <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-green-600 transition-colors">
                            {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                {(item as NamePlate).genre}
                            </span>
                        </div>
                    </div>
                </motion.div>
            );

        default:
            return null;
    }
}