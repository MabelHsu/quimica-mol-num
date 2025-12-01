import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, ChevronRight, CheckCircle, XCircle, RefreshCw, FlaskConical, Atom, ArrowRight } from 'lucide-react';

// --- Data & Content (Derived from uploaded PDF 1129.pdf) ---

const concepts = [
  {
    title: "化學計量基礎：係數的意義",
    content: (
      <div className="space-y-4">
        <p className="text-lg">化學方程式中的「係數」（前面的大數字），代表了參與反應的粒子數量比例，也代表<strong>莫耳數比</strong>。</p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="font-mono text-xl text-center mb-2">
            <span className="text-red-500 font-bold">2</span> H₂ + <span className="text-red-500 font-bold">1</span> O₂ → <span className="text-red-500 font-bold">2</span> H₂O
          </p>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
            <div className="text-center">2 莫耳</div>
            <div>:</div>
            <div className="text-center">1 莫耳</div>
            <div>:</div>
            <div className="text-center">2 莫耳</div>
          </div>
        </div>
        <p>這表示：每消耗 2 份的氫氣，就需要 1 份的氧氣，並產生 2 份的水。</p>
      </div>
    )
  },
  {
    title: "解題核心三步驟",
    content: (
      <div className="space-y-4">
        <p>遇到任何化學計量題目，請遵守這三個步驟：</p>
        <ol className="list-decimal list-inside space-y-3 pl-2">
          <li className="font-bold text-blue-700">寫出並平衡方程式</li>
          <li className="font-bold text-blue-700">找出係數比 (莫耳數比)</li>
          <li className="font-bold text-blue-700">將已知條件換算成莫耳數，利用比例求出未知數</li>
        </ol>
        <div className="bg-green-50 p-4 rounded-lg text-sm border border-green-200 mt-2">
          <p className="font-bold">常用公式備忘：</p>
          <ul className="list-disc list-inside mt-1">
            <li>莫耳數 (n) = 質量 (g) / 分子量 (MW)</li>
            <li>氣體體積 (STP) = 莫耳數 × 22.4 L</li>
          </ul>
        </div>
      </div>
    )
  }
];

// PDF Questions Translated and Adapted
const questions = [
  {
    id: 1,
    question: "已知方程式：3 PbCl₂ + Al₂(SO₄)₃ → 3 PbSO₄ + 2 AlCl₃。請問若從 3 莫耳的 Al₂(SO₄)₃ 開始反應，會生成多少莫耳的 PbSO₄？",
    options: ["1 莫耳", "2 莫耳", "3 莫耳", "6 莫耳", "9 莫耳"],
    correctIndex: 4,
    explanation: {
      step1: "方程式係數比 Al₂(SO₄)₃ : PbSO₄ = 1 : 3",
      step2: "題目給定 Al₂(SO₄)₃ 為 3 莫耳",
      step3: "計算：3 莫耳 × (3/1) = 9 莫耳",
      result: "9"
    }
  },
  {
    id: 2,
    question: "反應式：3 Fe + 4 H₂O → Fe₃O₄ + 4 H₂。若使用 4.76 莫耳的鐵 (Fe) 進行反應，會產生多少莫耳的氫氣 (H₂)？",
    options: ["6.35 mols", "63.5 mols", "12.7 mols", "1.27 mols", "3.17 mols"],
    correctIndex: 0,
    explanation: {
      step1: "方程式係數比 Fe : H₂ = 3 : 4",
      step2: "題目給定 Fe 為 4.76 莫耳",
      step3: "計算：4.76 × (4/3) ≈ 6.346...",
      result: "6.35"
    }
  },
  {
    id: 3,
    question: "實驗室製備氯氣反應：2 KMnO₄ + 16 HCl → 5 Cl₂ + 2 KCl + 2 MnCl₂ + 8 H₂O。若要製備 10 莫耳的氯氣 (Cl₂)，需要多少原料？",
    options: ["5 mol KMnO₄ 和 5 mol HCl", "1 mol KMnO₄ 和 16 mol HCl", "8 mol KMnO₄ 和 28 mol HCl", "2 mol KMnO₄ 和 30 mol HCl", "4 mol KMnO₄ 和 32 mol HCl"],
    correctIndex: 4,
    explanation: {
      step1: "係數比 KMnO₄ : HCl : Cl₂ = 2 : 16 : 5",
      step2: "目標：生成 10 莫耳 Cl₂ (是係數 5 的 2 倍)",
      step3: "因此所有反應物也要變為 2 倍。KMnO₄ = 2×2 = 4 mol; HCl = 16×2 = 32 mol",
      result: "4 mol KMnO₄ 和 32 mol HCl"
    }
  },
  {
    id: 6,
    question: "氫氣還原氧化鐵反應：Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O。若要產生 280 克的鐵 (Fe)，需要多少克的氧化鐵 (Fe₂O₃)？ (原子量: Fe=56, O=16)",
    options: ["150 g", "400 g", "200 g", "180 g", "160 g"],
    correctIndex: 1,
    explanation: {
      step1: "先算莫耳數：Fe 分子量 56。280g Fe = 280/56 = 5 莫耳 Fe。",
      step2: "找係數比：Fe₂O₃ : Fe = 1 : 2。需要 Fe₂O₃ 莫耳數 = 5 / 2 = 2.5 莫耳。",
      step3: "換算質量：Fe₂O₃ 分子量 = (56×2 + 16×3) = 160。質量 = 2.5 × 160 = 400g。",
      result: "400"
    }
  },
  {
    id: 7,
    question: "甲烷 (CH₄) 燃燒反應，當燃燒 80 克甲烷時，會釋放多少質量的二氧化碳 (CO₂)？ (原子量: H=1, C=12, O=16)",
    options: ["22 g", "44 g", "80 g", "120 g", "220 g"],
    correctIndex: 4,
    explanation: {
      step1: "寫出反應式：CH₄ + 2 O₂ → CO₂ + 2 H₂O",
      step2: "算莫耳數：CH₄ 分子量 16。80g CH₄ = 80/16 = 5 莫耳。",
      step3: "係數比 CH₄ : CO₂ = 1 : 1。故生成 5 莫耳 CO₂。CO₂質量 = 5 × 44 = 220g。",
      result: "220"
    }
  },
  {
    id: 9,
    question: "氨氣燃燒：2 NH₃ + 3/2 O₂ → N₂ + 3 H₂O。在標準狀態(STP)下，若使用 89.6 公升的氨氣 (NH₃)，可生成多少克的水？ (STP體積=22.4 L/mol, 水分子量=18)",
    options: ["216 g", "108 g", "72 g", "36 g", "18 g"],
    correctIndex: 1,
    explanation: {
      step1: "算莫耳數：STP下 1 mol = 22.4L。89.6L NH₃ = 89.6 / 22.4 = 4 莫耳。",
      step2: "係數比 NH₃ : H₂O = 2 : 3。生成 H₂O 莫耳數 = 4 × (3/2) = 6 莫耳。",
      step3: "換算質量：6 莫耳 × 18 (水的分子量) = 108g。",
      result: "108"
    }
  }
];

// --- Components ---

const IntroScreen = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-xl shadow-lg animate-fade-in">
    <div className="bg-blue-100 p-6 rounded-full mb-6">
      <FlaskConical size={64} className="text-blue-600" />
    </div>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">高一化學：化學計量大師</h1>
    <p className="text-gray-600 mb-8 max-w-md">
      從零開始學習化學反應計算。我們先從觀念開始，再挑戰精選題庫。
      <br/><br/>
      目標：學會利用方程式係數與莫耳數進行質量與體積的換算。
    </p>
    <button 
      onClick={onStart}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-md"
    >
      <BookOpen size={20} />
      開始學習
    </button>
  </div>
);

const LearningSlide = ({ data, onNext, isLast }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg min-h-[50vh] flex flex-col justify-between animate-fade-in">
    <div>
      <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        <Atom className="text-blue-500" />
        {data.title}
      </h2>
      <div className="text-gray-700 leading-relaxed">
        {data.content}
      </div>
    </div>
    <div className="mt-8 flex justify-end">
      <button 
        onClick={onNext}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        {isLast ? "進入練習題" : "下一步"}
        {isLast ? <Calculator size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  </div>
);

const QuizCard = ({ questionData, onAnswer, feedback, showFeedback, onNextQuestion }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          題目 {questionData.id}
        </span>
        {showFeedback && (
          <span className={`text-sm font-bold flex items-center gap-1 ${feedback.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
            {feedback.isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
            {feedback.isCorrect ? "答對了！" : "再想一下..."}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
        {questionData.question}
      </h3>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && onAnswer(index)}
            disabled={showFeedback}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              showFeedback
                ? index === questionData.correctIndex
                  ? "bg-green-100 border-green-500 text-green-800"
                  : index === feedback.selectedIndex
                    ? "bg-red-50 border-red-300 text-red-800 opacity-70"
                    : "bg-gray-50 border-gray-100 text-gray-400"
                : "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700"
            }`}
          >
            <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg animate-slide-up">
          <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
            <BookOpen size={18} />
            解題思路引導：
          </h4>
          <div className="space-y-2 text-sm text-gray-800">
            <p><span className="font-bold bg-white px-1 rounded">Step 1</span> {questionData.explanation.step1}</p>
            <p><span className="font-bold bg-white px-1 rounded">Step 2</span> {questionData.explanation.step2}</p>
            <p><span className="font-bold bg-white px-1 rounded">Step 3</span> {questionData.explanation.step3}</p>
            <p className="mt-2 font-bold text-blue-800">➤ 答案是：{questionData.explanation.result}</p>
          </div>
        </div>
      )}

      {showFeedback && (
        <button
          onClick={onNextQuestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors"
        >
          下一題 <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
};

const SummaryScreen = ({ score, total, onRestart }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg text-center animate-fade-in">
    <div className="mb-6">
      {score === total ? (
        <div className="text-green-500 p-4 bg-green-100 rounded-full inline-block">
          <CheckCircle size={64} />
        </div>
      ) : (
        <div className="text-blue-500 p-4 bg-blue-100 rounded-full inline-block">
          <FlaskConical size={64} />
        </div>
      )}
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">學習完成！</h2>
    <p className="text-xl text-gray-600 mb-6">
      你的得分：<span className="font-bold text-blue-600 text-2xl">{score}</span> / {total}
    </p>
    <p className="text-gray-500 mb-8 max-w-sm">
      {score === total 
        ? "太棒了！你已經完全掌握了化學計量的基礎概念！" 
        : "做得很不錯！建議可以再重新複習一次詳細解說，加深印象。"}
    </p>
    <button
      onClick={onRestart}
      className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors"
    >
      <RefreshCw size={20} />
      重新學習
    </button>
  </div>
);

// --- Main App ---

export default function App() {
  const [mode, setMode] = useState('intro'); // intro, learn, quiz, summary
  const [learnStep, setLearnStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ isCorrect: false, selectedIndex: -1 });

  const handleStart = () => {
    setMode('learn');
    setLearnStep(0);
  };

  const handleNextLearn = () => {
    if (learnStep < concepts.length - 1) {
      setLearnStep(prev => prev + 1);
    } else {
      setMode('quiz');
      setQuizStep(0);
      setScore(0);
      setShowFeedback(false);
    }
  };

  const handleAnswer = (index) => {
    const currentQ = questions[quizStep];
    const isCorrect = index === currentQ.correctIndex;
    setFeedback({ isCorrect, selectedIndex: index });
    if (isCorrect) setScore(prev => prev + 1);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (quizStep < questions.length - 1) {
      setQuizStep(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setMode('summary');
    }
  };

  const handleRestart = () => {
    setMode('intro');
    setScore(0);
    setQuizStep(0);
    setLearnStep(0);
    setShowFeedback(false);
  };

  // Progress Bar Calculation
  const getProgress = () => {
    if (mode === 'learn') return ((learnStep + 1) / concepts.length) * 30;
    if (mode === 'quiz') return 30 + ((quizStep + (showFeedback ? 1 : 0)) / questions.length) * 70;
    if (mode === 'summary') return 100;
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-800 py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-xl">
          <FlaskConical className="text-blue-600" />
          <span>ChemiLearn</span>
        </div>
        {mode !== 'intro' && mode !== 'summary' && (
          <div className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            {mode === 'learn' ? '觀念引導' : '實戰演練'}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {mode !== 'intro' && mode !== 'summary' && (
        <div className="max-w-2xl mx-auto mb-8 bg-gray-300 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto">
        {mode === 'intro' && <IntroScreen onStart={handleStart} />}
        
        {mode === 'learn' && (
          <LearningSlide 
            data={concepts[learnStep]} 
            onNext={handleNextLearn} 
            isLast={learnStep === concepts.length - 1} 
          />
        )}

        {mode === 'quiz' && (
          <QuizCard 
            questionData={questions[quizStep]}
            onAnswer={handleAnswer}
            feedback={feedback}
            showFeedback={showFeedback}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {mode === 'summary' && (
          <SummaryScreen 
            score={score} 
            total={questions.length} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs mt-12">
        <p>© 2024 高一化學互動教室 | Based on content from 1129.pdf</p>
      </footer>
    </div>
  );
}