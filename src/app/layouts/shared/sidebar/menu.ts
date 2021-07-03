import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'ri-dashboard-line',
        link: '/dashboard'
    },
    {
        id: 3,
        label: 'MENUITEMS.PROJECTS.TEXT',
        icon: 'fas fa-project-diagram',
        link: '/projects'
    },
    {
        id: 4,
        label: 'MENUITEMS.INVESTORS.TEXT',
        icon: 'mdi mdi-account-cash',
        link: '/investors'
    },
    {
        id: 5,
        label: 'MENUITEMS.CREATORS.TEXT',
        icon: 'mdi mdi-account-cog',
        link: '/creators'
    },
 
    {
        id: 49,
        label: 'MENUITEMS.FORMS.TEXT',
        icon: 'ri-eraser-fill',
        subItems: [
            {
                id: 50,
                label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                link: '/form/elements',
                parentId: 49
            },
            {
                id: 52,
                label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                link: '/form/advanced',
                parentId: 49
            },
        ]
    },
    {
        id: 57,
        label: 'MENUITEMS.TABLES.TEXT',
        icon: 'ri-table-2',
        link: '/tables/advanced'
    }
];
