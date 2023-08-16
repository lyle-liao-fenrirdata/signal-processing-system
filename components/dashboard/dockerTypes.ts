
export interface DockerNode {
    ID: string;
    Version: {
        Index: number;
    };
    CreatedAt: string;
    UpdatedAt: string;
    Spec: {
        Name?: string;
        Labels?: {
            [key: string]: string;
        };
        Role: "worker" | "manager";
        Availability: "active" | "pause" | "drain";
    };
    Description: {
        Hostname: string;
        Platform: {
            Architecture: string;
            OS: string;
        };
        Resources: {
            NanoCPUs: number;
            MemoryBytes: number;
            GenericResources?: {
                NamedResourceSpec: {
                    Kind: string;
                    Value: string;
                };
                DiscreteResourceSpec: {
                    Kind: string;
                    Value: number;
                };
            }[];
        };
        Engine: {
            EngineVersion: string;
            Labels?: {
                [key: string]: string;
            };
            Plugins: {
                Type: string;
                Name: string;
            }[];
        };
        TLSInfo: {
            TrustRoot: string;
            CertIssuerSubject: string;
            CertIssuerPublicKey: string;
        };
    };
    Status: {
        State: "unknown" | "down" | "ready" | "disconnected";
        Message?: string;
        Addr: string;
    };
    ManagerStatus?: {
        Leader: boolean;
        Reachability: "unknown" | "unreachable" | "reachable";
        Addr: string;
    };
}

interface DockerEndpointSpec {
    Mode: "vip" | "dnsrr";
    Ports?: {
        Protocol: string;
        TargetPort: number;
        PublishedPort: number;
        PublishMode: string;
    }[];
}

interface DockerServiceSpec {
    Name: string;
    Labels: {
        [key: string]: string;
    };
    TaskTemplate: any;
    Mode: {
        Replicated?: {
            Replicas: number;
        };
        Global?: any;
    };
    UpdateConfig?: any;
    RollbackConfig?: any;
    Networks?: {
        Target: string;
        Aliases: string[];
    }[];
    EndpointSpec: DockerEndpointSpec;
}

export interface DockerService {
    ID: string;
    Version: {
        Index: number;
    };
    CreatedAt: string;
    UpdatedAt: string;
    Spec: DockerServiceSpec;
    PreviousSpec?: any;
    Endpoint: {
        Spec: DockerEndpointSpec;
        Ports?: {
            Protocol: string;
            TargetPort: number;
            PublishedPort: number;
            PublishMode: string;
        }[];
        VirtualIPs?: {
            NetworkID: string;
            Addr: string;
        }[];
    };
    UpdateStatus?: {
        State: "updating" | "paused" | "completed";
        StartedAt: string;
        CompletedAt: string;
        Message: string;
    };
}

export const dockerNodeErrorCodes = {
    400: "Bad Parameter",
    404: "No Such Node",
    500: "Server Error",
    503: "Node is not part of a swarm.",
};

export const dockerServiceErrorCodes = {
    500: "Server Error",
    503: "Node is not part of a swarm.",
};