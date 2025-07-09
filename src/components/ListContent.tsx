import State from "@/components/State";

interface ListContentProps {
    category: string;
}

export default function ListContent({ category }: ListContentProps) {

    return (
        <>
            <State beforeAccept={0} beforeSign={0} complete={0} />
            <div className="py-2 flex flex-col space-y-2">
                <div className="px-4 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose">
                    {category}
                </div>
                <div className="bg-white rounded-2xl shadow p-12 flex justify-center shadow-md">
                   
                </div>
            </div>
        </>
    )
}