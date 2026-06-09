package io.quarkus.demo;

import java.util.Map;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/api/auth-config")
@PermitAll
public class AuthConfigResource {

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    String authServerUrl;

    @ConfigProperty(name = "quarkus.oidc.client-id")
    String clientId;

    @GET
    public Map<String, String> config() {
        String url = authServerUrl;
        if (url.contains("/realms/")) {
            url = url.substring(0, url.indexOf("/realms/"));
        }
        String realm = "quarkus";
        if (authServerUrl.contains("/realms/")) {
            realm = authServerUrl.substring(authServerUrl.lastIndexOf("/realms/") + 8);
        }
        return Map.of("url", url, "realm", realm, "clientId", clientId);
    }
}
