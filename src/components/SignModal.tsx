import Naver from "@/assets/icon/naver.png";

export function SignStepOne({ onNext }: { onNext: () => void }) {
    return (
        <div className="bg-white rounded-2xl py-16 px-32 max-w-[900px] w-full mx-auto min-h-[400px] flex flex-col items-center gap-10 shadow-lg">
            <h2 className="text-center text-black text-2xl font-bold leading-relaxed font-['Inter'] max-w-[600px]">
                서류 작성을 위한 본인 인증을 요청합니다
            </h2>

            <div className="flex flex-col gap-6 w-full max-w-[400px]">
                <button
                    onClick={onNext}
                    className="bg-[#FFE812] w-full py-3 rounded-full font-bold flex items-center justify-center gap-3 text-black font-['Pretendard'] text-lg"
                >
                    <img
                        src="https://d1nuzc1w51n1es.cloudfront.net/c9b51919f15c93b05ae8.png"
                        alt="KakaoTalk logo"
                        className="w-8 h-8"
                    />
                    카카오톡으로 인증하기
                </button>

                <button
                    onClick={onNext}
                    className="w-full py-3 rounded-full font-bold flex items-center justify-center gap-3 text-white font-['Pretendard'] text-lg"
                    style={{ backgroundColor: '#03C75A' }}
                >
                    <img
                        src={Naver}
                        alt="Naver logo"
                        className="w-8 h-8"
                    />
                    네이버로 인증하기
                </button>
            </div>
        </div>
    );
}

export function SignStepTwo({ onNext }: { onNext: () => void }) {
    return (
        <div className="bg-white py-16 px-32 rounded-2xl flex flex-col items-center justify-center gap-6 shadow-lg">
            <h2 className="text-2xl font-bold">서류 작성을 위한 본인 인증을 요청합니다</h2>
            <input type="text" placeholder="이름" className="border p-2 w-full" />
            <input type="text" placeholder="휴대폰번호" className="border p-2 w-full" />
            <button onClick={onNext} className="bg-blue-500 mt-6 text-white py-2 px-8 rounded-xl">다음</button>
        </div>
    );
}

export function SignStepThree({ onConfirm }: { onConfirm: () => Promise<void> }) {
    return (
        <div className="bg-white py-16 px-32 rounded-2xl flex flex-col items-center justify-center gap-6 shadow-lg">
            <h2 className="text-2xl font-bold">서류 작성을 위한 본인 인증을 요청합니다</h2>
            <div className="text-left w-full space-y-2">
                <label><input type="checkbox" className="mr-2" defaultChecked /> 개인정보수집이용동의(필수)</label><br />
                <label><input type="checkbox" className="mr-2" defaultChecked /> 서비스이용약관동의(필수)</label><br />
                <label><input type="checkbox" className="mr-2" defaultChecked /> 제3자정보제공동의(필수)</label><br />
                <label><input type="checkbox" className="mr-2" defaultChecked /> 고유식별정보처리동의(필수)</label>
            </div>
            <button onClick={onConfirm} className="bg-blue-500 mt-6 text-white py-2 px-8 rounded-xl">
                완료
            </button>
        </div>
    );
}  
