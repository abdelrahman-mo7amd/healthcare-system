# Minikube Ingress + TLS setup

```bash
# 1. Start Minikube and enable the NGINX Ingress addon
minikube start
minikube addons enable ingress

# 2. Build images directly into Minikube's Docker daemon (skips a registry)
eval $(minikube docker-env)
docker build -t hospital-backend:latest ../../backend
docker build -t hospital-appointment-service:latest ../../microservices/appointment-service
docker build -t hospital-frontend:latest ../../frontend

# In each *-deployment.yaml, set image to the tag above and
# imagePullPolicy: Never (so Kubernetes uses the local image instead
# of trying to pull from a registry).

# 3. Generate a mock self-signed certificate for hospital.local
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout hospital.local.key \
  -out hospital.local.crt \
  -subj "/CN=hospital.local/O=hospital.local"

# 4. Create the TLS secret the Ingress references
kubectl create secret tls hospital-tls-secret \
  --cert=hospital.local.crt --key=hospital.local.key

# 5. Apply everything
kubectl apply -f mongo-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f appointment-service-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml

# 6. Point hospital.local at Minikube's IP
echo "$(minikube ip) hospital.local" | sudo tee -a /etc/hosts   # Linux/macOS
# On Windows: add "<minikube ip> hospital.local" to
# C:\Windows\System32\drivers\etc\hosts (as Administrator)

# 7. Verify
curl -k https://hospital.local/api/health
curl -k https://hospital.local/api/appointments/stats
kubectl get hpa
kubectl get pods -w   # watch pods scale under load
```

## Simulating load to prove auto-scaling

```bash
kubectl run load-generator --image=busybox --restart=Never -- \
  /bin/sh -c "while true; do wget -q -O- https://backend:5000/api/health; done"
kubectl get hpa backend-hpa --watch
```

Watch `REPLICAS` climb as CPU utilization crosses the 70% threshold defined
in `backend-deployment.yaml`'s `HorizontalPodAutoscaler`.
