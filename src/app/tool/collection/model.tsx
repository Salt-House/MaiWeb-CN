


export interface NamePlate {
    collection_id: string,
    name: string,
    description: string,
    genre: string
}

export interface MaiBackGround {
    collection_id: string,
    name: string,
    description: string,
    genre: string
}

export interface Icon {
    collection_id: string,
    name: string,
    description: string,
    genre: string
}

export interface Trophie {
    collection_id: string,
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