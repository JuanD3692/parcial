export interface Module {
    moduleName: string
    modulePath: string
    assigned: boolean
    id?: number 
}

export interface Role {
    id: number
    rol: string
    modules: Module[]
    expanded?: boolean
    isEditing?: boolean
}

export interface IRolXModules {
    id: number;
    rol: string; 
    modules: Module[]; 
}