
import React, { useState } from 'react';
import { UserStats, Badge, LogEntry, FocusStatus } from '../types';
import { BADGES, getLeaderboard, calculateDailyScore } from '../services/gamification';
import { Trophy, Star, Clock, Target, Lock, Medal, AlertTriangle, Calendar, Share2, X, QrCode } from 'lucide-react';

interface StatsViewProps {
  stats: UserStats;
  logs: LogEntry[];
}

const StatsView: React.FC<StatsViewProps> = ({ stats, logs }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const currentScore = calculateDailyScore(stats);
  const leaderboard = getLeaderboard(currentScore);
  const earnedBadgeIds = stats.badges;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} 分钟`;
  };

  // Filter logs for distractions
  const distractionLogs = logs.filter(
    log => log.status === FocusStatus.DISTRACTED || log.status === FocusStatus.ABSENT || log.status === FocusStatus.BAD_POSTURE
  );

  return (
    <div className="p-5 space-y-8 animate-in slide-in-from-right duration-500 pb-20 relative">
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-900 rounded-3xl p-1 w-full max-w-sm shadow-2xl relative">
            <button 
                onClick={() => setShowShareModal(false)}
                className="absolute -top-3 -right-3 bg-white text-black rounded-full p-2 shadow-lg z-20"
            >
                <X size={20} />
            </button>
            
            <div className="bg-gray-900/90 rounded-[22px] p-6 text-center border border-white/10 h-full flex flex-col items-center">
                <div className="mb-4">
                    <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Trophy size={40} className="text-white" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">今日专注战报</h2>
                <p className="text-gray-400 text-xs mb-6">{new Date().toLocaleDateString()}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                    <div className="bg-white/5 p-3 rounded-xl">
                        <p className="text-xs text-gray-400 mb-1">专注时长</p>
                        <p className="text-xl font-bold text-white">{Math.floor(stats.totalFocusTimeSeconds / 60)}<span className="text-xs ml-1 font-normal">分钟</span></p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                        <p className="text-xs text-gray-400 mb-1">专注评分</p>
                        <p className="text-xl font-bold text-yellow-400">{currentScore}</p>
                    </div>
                </div>

                <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl mb-6 border border-white/10">
                    <p className="text-sm text-gray-200 italic">
                        "宝贝今天获得了 {earnedBadgeIds.length} 枚徽章，击败了 88% 的小朋友！"
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 w-full flex items-center justify-between gap-4">
                    <div className="text-left">
                        <p className="font-bold text-white text-sm">专注卫士</p>
                        <p className="text-[10px] text-gray-500">AI 智能学伴</p>
                    </div>
                    <div className="bg-white p-1 rounded">
                        <QrCode size={40} className="text-black" />
                    </div>
                </div>
                
                <p className="text-[10px] text-gray-500 mt-4 w-full text-center border-t border-white/5 pt-2">
                    截屏分享给好友或朋友圈
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Share Button */}
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">成就统计</h2>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            <Share2 size={14} />
            生成战报
          </button>
      </div>
      
      {/* Score Card */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden border border-white/10 group">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
          <Trophy size={140} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
             <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">今日专注力评分</p>
             <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold">Level {Math.floor(stats.totalFocusTimeSeconds / 600) + 1}</div>
          </div>
          
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-indigo-200 bg-clip-text text-transparent drop-shadow-sm">
              {currentScore}
            </h2>
            <span className="text-xl font-medium text-indigo-300">/ 100</span>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex-1 bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl flex flex-col justify-center border border-white/5">
              <div className="flex items-center gap-2 text-indigo-200 mb-1">
                <Clock size={14} />
                <span className="text-xs font-bold uppercase">专注时长</span>
              </div>
              <span className="text-lg font-bold">{formatTime(stats.totalFocusTimeSeconds)}</span>
            </div>
            
            <div className="flex-1 bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl flex flex-col justify-center border border-white/5">
              <div className="flex items-center gap-2 text-indigo-200 mb-1">
                <Target size={14} />
                 <span className="text-xs font-bold uppercase">分心次数</span>
              </div>
              <span className="text-lg font-bold">{stats.distractionCount} 次</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Log History */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gray-800/50">
           <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20">
               <Calendar className="text-red-400" size={16} />
            </div>
            今日分心记录
          </h3>
          <span className="text-[10px] font-bold text-gray-500 bg-black/20 px-2 py-1 rounded-md uppercase tracking-wide">Today</span>
        </div>
        <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {distractionLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">🎉 太棒了！今天还没有分心记录。</p>
                </div>
            ) : (
                <div className="divide-y divide-white/5">
                    {distractionLogs.map((log) => (
                        <div key={log.id} className="flex items-start p-4 hover:bg-white/5 transition-colors">
                            <div className="min-w-[60px] text-xs font-mono text-gray-400 mt-0.5">
                                {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className="flex-1 ml-2">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={12} className={log.status === FocusStatus.ABSENT ? "text-yellow-500" : (log.status === FocusStatus.BAD_POSTURE ? "text-blue-400" : "text-red-500")} />
                                    <span className={`text-sm font-bold ${log.status === FocusStatus.ABSENT ? "text-yellow-200" : (log.status === FocusStatus.BAD_POSTURE ? "text-blue-200" : "text-red-200")}`}>
                                        {log.status === FocusStatus.ABSENT ? "离开座位" : (log.status === FocusStatus.BAD_POSTURE ? "坐姿不端" : "分心走神")}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{log.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="text-white font-bold text-lg flex items-center gap-2">
             <div className="p-1.5 rounded-lg bg-yellow-500/20">
               <Star className="text-yellow-400" size={16} fill="currentColor" />
             </div>
             成就徽章
           </h3>
           <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
             {earnedBadgeIds.length} / {BADGES.length}
           </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = earnedBadgeIds.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 group ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border-yellow-500/30 shadow-lg shadow-yellow-500/5 hover:border-yellow-500/50' 
                    : 'bg-gray-900 border-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`text-3xl filter ${isUnlocked ? 'drop-shadow-md' : 'grayscale contrast-50'}`}>
                    {badge.icon}
                  </div>
                  {!isUnlocked && <Lock size={14} className="text-gray-600" />}
                </div>
                
                <div>
                  <p className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-gray-100' : 'text-gray-500'}`}>
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    {badge.description}
                  </p>
                </div>
                
                {isUnlocked && (
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-500/20 blur-xl rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gray-800/50">
           <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20">
               <Medal className="text-orange-400" size={16} />
            </div>
            好友排行
          </h3>
          <span className="text-[10px] font-bold text-gray-500 bg-black/20 px-2 py-1 rounded-md uppercase tracking-wide">Weekly</span>
        </div>
        <div className="divide-y divide-white/5">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.id}
              className={`flex items-center p-4 transition-colors ${
                entry.isCurrentUser ? 'bg-indigo-500/10 hover:bg-indigo-500/20' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-8 font-bold text-center mr-2 flex justify-center">
                 {index === 0 && <span className="text-xl drop-shadow-sm">🥇</span>}
                 {index === 1 && <span className="text-xl drop-shadow-sm">🥈</span>}
                 {index === 2 && <span className="text-xl drop-shadow-sm">🥉</span>}
                 {index > 2 && <span className="text-sm text-gray-600 font-mono">#{index + 1}</span>}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg mr-4 border-2 border-gray-600/50 shadow-sm relative">
                {entry.avatar}
                {entry.isCurrentUser && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${entry.isCurrentUser ? 'text-indigo-300' : 'text-gray-200'}`}>
                    {entry.name} {entry.isCurrentUser && '(我)'}
                </p>
                <p className="text-[10px] text-gray-500">
                    专注于 {Math.round(entry.score * 0.4)} 分钟
                </p>
              </div>
              
              <div className="text-right">
                  <span className="block font-black text-lg text-white leading-none">{entry.score}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsView;
