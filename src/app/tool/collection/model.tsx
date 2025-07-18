


interface NamePlate {
    id: string,
    name: string,
    description: string,
    genre: string
}
interface MaiBackGround {
    id: string,
    name: string,
    description: string,
    genre: string
}
interface Icon {
    id: string,
    name: string,
    description: string,
    genre: string
}
interface Trophie {
    id: string,
    name: string,
    color: string,
}

interface SetCollectionProps {
    type: string,
    id: number,
}

interface Condition {
    category: string,
    condition: string,
    condition_CN?: string,
}