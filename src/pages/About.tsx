import {Button} from "@/components/ui/button";
import {Play} from "lucide-react";
import {Link} from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#202124] text-white relative overflow-hidden">
      {/* Header */}
      {/* <header className="fixed top-0 w-full flex justify-between items-center p-4 z-50">
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-white/80">返回首页</Link>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto flex flex-col items-center justify-start min-h-screen px-4 pt-24 relative z-10">
        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-lg mb-8">
            我们的使命是将
            <span className="text-[#4285f4]">玄学</span>
            与
            <span className="text-[#ea4335]">智能</span>
            相结合，使其
            <span className="text-[#34a853]">普遍可及</span>
            且
            <span className="text-[#fbbc05]">实用</span>。
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-24 w-full max-w-2xl">
          <div className="relative bg-[#303134] rounded-lg overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                className="bg-black/50 hover:bg-black/70 border-none text-white gap-2"
              >
                <Play className="h-5 w-5" />
                观看视频
              </Button>
            </div>
          </div>
          <h2 className="text-center text-2xl mt-6 mb-3">
            数字玄学2.0：我们最新最强大的占卜系统
          </h2>
          <div className="text-center">
            <Link to="/" className="text-[#8ab4f8] hover:underline">
              了解更多
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl mb-12">让玄学智能助你轻松解惑</h2>
          <div className="flex gap-4 justify-center">
            <Button className="bg-[#8ab4f8] hover:bg-[#8ab4f8]/90 text-black">
              查看所有解卦方式
            </Button>
            <Button variant="outline" className="bg-[#303134] border-none text-white hover:bg-white/10">
              获取使用帮助
            </Button>
          </div>
        </div>

        {/* Divination Tools Section */}
        <div className="w-full max-w-2xl mb-24">
          <div className="bg-[#f8f9fa] rounded-lg p-8 aspect-[4/3] flex items-center justify-center">
            <span className="text-6xl">卦</span>
          </div>
          <h2 className="text-center text-2xl mt-6 mb-3">
            体验AI智能占卜，让解卦更简单
          </h2>
          <div className="text-center">
            <Link to="/" className="text-[#8ab4f8] hover:underline">
              探索完整占卜系统
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full pb-8">
          <div className="flex justify-between items-center border-t border-[#3c4043] py-8 mb-8">
            <div className="text-sm">关注我们</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/80">微信</a>
              <a href="#" className="hover:text-white/80">微博</a>
              <a href="#" className="hover:text-white/80">抖音</a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-t border-[#3c4043]">
              <span className="text-sm font-medium">资源</span>
              <span className="text-[#9aa0a6]">+</span>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-[#3c4043]">
              <span className="text-sm font-medium">服务与支持</span>
              <span className="text-[#9aa0a6]">+</span>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-[#3c4043]">
              <span className="text-sm font-medium">研究与技术</span>
              <span className="text-[#9aa0a6]">+</span>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-[#3c4043]">
              <span className="text-sm font-medium">关于我们</span>
              <span className="text-[#9aa0a6]">+</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-8 border-t border-[#3c4043] text-sm">
            <div className="flex items-center gap-4">
              <span className="text-2xl">卦</span>
              <a href="#" className="text-[#9aa0a6] hover:text-white">帮助</a>
              <a href="#" className="text-[#9aa0a6] hover:text-white">隐私</a>
              <a href="#" className="text-[#9aa0a6] hover:text-white">条款</a>
            </div>
            <select className="bg-transparent text-[#9aa0a6] outline-none">
              <option value="zh">简体中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default About;
