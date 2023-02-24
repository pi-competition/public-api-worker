export declare module RemoteConfig {
    export interface AdditionalContext {
        config: RemoteConfig
    }

    export interface DisabledRoute {
        path: string;
        methods: string[];
    }

    export interface RemoteConfig {
        maintenance: boolean;
        alwaysRequireAuth: boolean;
        allCarsStatus: "online" | "offline" | "busy";
        disabledRoutes: DisabledRoute[];
        password: string;
    }
}