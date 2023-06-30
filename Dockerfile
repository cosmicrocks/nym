# Stage 1: Building the code
FROM rust:1.69 as builder

# Install necessary packages for building the application and its dependencies (musl, gtk, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    musl-tools \
    musl-dev \
    libudev-dev \
    libgtk-3-dev \
    libsoup2.4-dev \
    libjavascriptcoregtk-4.0-dev \
    libwebkit2gtk-4.0-dev

RUN update-ca-certificates

# Add the musl target for compiling to musl libc (statically linked binaries)
RUN rustup target add x86_64-unknown-linux-musl

# Add the wasm32 target for compiling to WebAssembly (WASM)
RUN rustup target add wasm32-unknown-unknown

# Add the clippy component for linting the code during build time
RUN rustup component add clippy

# Add the rustfmt component for formatting the code during build time
RUN rustup component add rustfmt

# Add the wasm-opt tool for optimizing the WASM binaries
RUN cargo install --version 0.112.0 wasm-opt

# Set working directory to /usr/src
WORKDIR /usr/src

# Copy all required dependencies into the image
COPY . .

# Compile the code
RUN make build-release

# Stage 2: Final stage
FROM debian:buster-slim

RUN apt-get update && \
    apt-get install -y libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

#copy the compiled binaries from the builder stage
COPY --from=builder /usr/src/target/release/nym-client /usr/bin/nym-client
COPY --from=builder /usr/src/target/release/nym-gateway /usr/bin/nym-gateway
COPY --from=builder /usr/src/target/release/nym-mixnode /usr/bin/nym-mixnode
COPY --from=builder /usr/src/target/release/nym-socks5-client /usr/bin/nym-socks5-client
COPY --from=builder /usr/src/target/release/nym-api /usr/bin/nym-api
COPY --from=builder /usr/src/target/release/nym-network-requester /usr/bin/nym-network-requester
COPY --from=builder /usr/src/target/release/nym-network-statistics /usr/bin/nym-network-statistics
COPY --from=builder /usr/src/target/release/nym-cli /usr/bin/nym-cli
COPY --from=builder /usr/src/target/release/nym-credential-client /usr/bin/nym-credential-client
COPY --from=builder /usr/src/target/release/explorer-api /usr/bin/explorer-api

#copy the compiled contracts from the builder stage
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/mixnet_contract.wasm /usr/bin/mixnet_contract.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/vesting_contract.wasm /usr/bin/vesting_contract.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/nym_coconut_bandwidth.wasm /usr/bin/nym_coconut_bandwidth.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/nym_coconut_dkg.wasm /usr/bin/nym_coconut_dkg.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/cw3_flex_multisig.wasm /usr/bin/cw3_flex_multisig.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/cw4_group.wasm /usr/bin/cw4_group.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/nym_service_provider_directory.wasm /usr/bin/nym_service_provider_directory.wasm
COPY --from=builder /usr/src/contracts/target/wasm32-unknown-unknown/release/nym_name_service.wasm /usr/bin/nym_name_service.wasm
