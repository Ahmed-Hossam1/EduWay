import { Fragment } from "react";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbStep = {
    label: string;
    href?: string; // no href → the current page (the last step)
};

/**
 * The small "Home / Courses" path at the top of a page.
 *
 *   <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
 */
export function PageBreadcrumb({ items }: { items: BreadcrumbStep[] }) {
    return (
        <Breadcrumb>
            <BreadcrumbList className="text-xs font-medium">
                {items.map((item, index) => (
                    <Fragment key={item.label}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink render={<Link href={item.href} />} className="hover:text-primary">
                                    {item.label}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
