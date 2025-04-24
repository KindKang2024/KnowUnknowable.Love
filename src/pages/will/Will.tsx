import {DiviWillInput} from "@/pages/will/components/DiviWillInput";
import {BaguaDukiDAO} from "@/pages/divi/components/BaguaDukiDao.tsx";
import {animated, config, useSpring} from "@react-spring/web";
import DivinationTabs from "@/pages/will/DivinationTabs";
import {usePageWillData} from "@/i18n/DataProvider";

const Will = () => {
  const willPageData = usePageWillData();
  const fadeInUpSpring = useSpring({
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: {
      transform: 'translateY(0px)',
      opacity: 1
    },
    config: config.gentle
  });

  const containerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle
  });

  return (
    <animated.div
      style={containerSpring}
      className="relative flex flex-col items-center justify-start px-4 py-6"
    >
      <div className="relative z-10 text-center w-full max-w-7xl mx-auto">
        <animated.div style={fadeInUpSpring}>
          <div
            className="mt-4 inset-0 overflow-hidden w-20 h-20 sm:w-24 sm:h-24 mx-auto animate-[spin_64s_linear_infinite]">
            <BaguaDukiDAO showText={false} />
          </div>
        </animated.div>

        <animated.h1
          style={fadeInUpSpring}
          className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-cinzel font-bold text-glow mb-4 sm:mb-6 px-2"
        >
          {willPageData.diviAlgo}
        </animated.h1>

        <animated.p
          style={fadeInUpSpring}
          className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto font-inter px-4"
        >
          {willPageData.diviAlgoDescription}
        </animated.p>

        <animated.div style={fadeInUpSpring} className="flex justify-center px-4">
          <DiviWillInput />
        </animated.div>

        <animated.div style={fadeInUpSpring} className="mt-6 mb-6 flex justify-center">
          <div className="w-full max-w-2xl px-4">
            <div className="h-px bg-gradient-to-r from-white/0 via-white/50 to-white/0"></div>
          </div>
        </animated.div>

        <animated.div style={fadeInUpSpring} className="mt-6 sm:mt-8 max-w-6xl mx-auto px-2 sm:px-4">
          <DivinationTabs />
        </animated.div>

        {/* Journey to Enlightenment - Vertical Layout */}
        <animated.div style={fadeInUpSpring} className="mt-10 sm:mt-12 md:mt-14 max-w-6xl mx-auto px-4">
          {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-center text-glow mb-3">
            {willPageData.diviAlgoStepsTitle}
          </h2>
          <p className="text-center text-white/70 mb-16 max-w-3xl mx-auto">
            The essence of being manifests through understanding, division, and unification
          </p> */}

          <div className="flex flex-col space-y-24 sm:space-y-32 md:space-y-40">
            <div className="text-center relative">
              <div
                className="absolute inset-0 bg-gradient-radial from-purple-500/10 to-transparent blur-2xl -z-10"></div>

              <div
                className="max-w-4xl mx-auto px-6 py-8 border border-purple-500/20 rounded-lg bg-black/40 backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-white mb-4">
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300">
                    {willPageData.iChingToKnow} 
                  </span>

                  <span className="block text-[8px] sm:text-[8px] md:text-[14px] text-white/60">
                    {willPageData.iChingToKnowTarget} 
                  </span>
                </h2>

                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                </div>

                <p className="text-base sm:text-lg font-serif italic text-white/90 mb-8 border-l-2 border-purple-400/50 pl-4 max-w-2xl mx-auto text-left">
                  {willPageData.loveWillRepresentation} 
                  <span className="ml-2 mt-2 text-xs sm:text-sm font-normal not-italic">
                    {willPageData.iChingToKnowDescription}
                  </span>
                </p>

              </div>
            </div>

            {
              willPageData.diviAlgoSteps.map((step, index) => (
                <div className="text-center relative">
                <div
                  className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent blur-2xl -z-10"></div>
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-white/30 to-white/10 p-[1px]">
                  <div
                    className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-cinzel font-bold text-glow">{index + 1}</span>
                  </div>
                </div>
  
                {/* Vertical connecting line */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 h-20 w-[1px]">
                  <div className="h-full w-full bg-gradient-to-t from-white/30 to-transparent"></div>
                </div>
  
                <h3 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-white mb-4">
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                    {step.title}
                  </span>
                </h3>

                <div
                  className="max-w-3xl mx-auto px-5 py-7 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm">
                  <p className="text-base sm:text-lg text-white/90 mb-2 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: step.short_description }} />
                  </p>
  
                  <div
                    className="w-16 h-px mx-auto my-4 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
  
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: step.long_description }} />
                  </p>
                </div>
              </div>

              ))
            }
          </div>
        </animated.div>
      </div>
    </animated.div>
  );
};

export default Will;
