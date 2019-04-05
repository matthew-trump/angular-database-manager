export interface EntityField {

    name: string;
    required?: boolean;
    editable?: boolean;
    foreignKey?: string;
    all?: boolean;
    input?: any;
    label?: string;


}