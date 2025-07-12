export default function UnLoginContent() {
    return (
        <>
            <div className="py-2 flex flex-col space-y-2">
                <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                    최근 열람한 문서
                </div>
                <div className="bg-white rounded-2xl shadow p-12 flex justify-center shadow-md">
                    <p className="text-neutral-400 text-3xl py-16">로그인하여 문서를 확인하세요</p>
                </div>
            </div>

            <div className="py-2 flex gap-6">
                <div className="flex flex-col flex-1 space-y-2">
                    <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                        내 서명 대기
                    </div>
                    <div className="bg-white rounded-2xl shadow p-5 flex-grow flex items-center justify-center shadow-md">
                        <p className="text-blue-500 text-xl py-8">로그인하세요</p>
                    </div>
                </div>
                <div className="flex flex-col flex-1 space-y-2">
                    <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                        상대 서명 대기
                    </div>
                    <div className="bg-white rounded-2xl shadow p-5 flex-grow flex items-center justify-center shadow-md">
                        <p className="text-blue-500 text-xl py-8">로그인하세요</p>
                    </div>
                </div>
            </div>
        </>
    )
}