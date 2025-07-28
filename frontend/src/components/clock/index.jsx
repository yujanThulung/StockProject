import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

export default function LiveClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className="flex items-center gap-1">
            <FiClock />
            {currentTime.toLocaleTimeString()}
        </span>
    );
}
