export interface NavItem {
    label: string;
    href: string;
}

export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterColumn {
    title: string;
    links: FooterLink[];
}

// T = the field names of the form, e.g. Input<keyof CourseDetailsValues>
// (PropertyKey = string | number | symbol, the same as "keyof any" without the any)
export interface Input<T extends PropertyKey> {
    id: string;
    name: T;
    type: string;
    label?: string;
    placeholder?: string;
}