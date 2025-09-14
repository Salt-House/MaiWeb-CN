


export interface NamePlate {
    id: string,
    name: string,
    description: string,
    genre: string
}

export interface MaiBackGround {
    id: string,
    name: string,
    description: string,
    genre: string
}

export interface Icon {
    id: string,
    name: string,
    description: string,
    genre: string
}

export interface Trophie {
    id: string,
    name: string,
    description: string,
    color: string,
}

export interface SetCollectionProps {
    type: string,
    id: number,
}

export interface Condition {
    category: string,
    condition: string,
    condition_CN?: string,
}