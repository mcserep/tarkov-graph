import {createContext, useContext, useState, ReactNode} from 'react';

interface TargetTaskContextType {
    targetTaskIds: Set<string>;
    setTargetTaskIds: (taskIds: Set<string>) => void;
}

const TargetTaskContext = createContext<TargetTaskContextType | undefined>(undefined);

export function TargetTaskProvider({children}: {children: ReactNode}) {
    const [targetTaskIds, setTargetTaskIds] = useState<Set<string>>(new Set<string>());

    return (
        <TargetTaskContext.Provider value={{targetTaskIds, setTargetTaskIds}}>
            {children}
        </TargetTaskContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTargetTask() {
    const context = useContext(TargetTaskContext);
    if (context === undefined) {
        throw new Error('useTargetTask must be used within a TargetTaskProvider');
    }
    return context;
}

