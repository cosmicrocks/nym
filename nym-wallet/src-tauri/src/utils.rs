// Copyright 2022 - Nym Technologies SA <contact@nymtech.net>
// SPDX-License-Identifier: Apache-2.0

use crate::error::BackendError;
use crate::nyxd_client;
use crate::state::WalletState;
use cosmwasm_std::Decimal;
use nym_mixnet_contract_common::{IdentityKey, MixId, Percent};
use nym_types::currency::DecCoin;
use nym_types::mixnode::MixNodeCostParams;
use nym_validator_client::nyxd::contract_traits::MixnetQueryClient;
use nym_wallet_types::app::AppEnv;

fn get_env_as_option(key: &str) -> Option<String> {
    match ::std::env::var(key) {
        Ok(res) => Some(res),
        Err(_e) => None,
    }
}

#[tauri::command]
pub fn get_env() -> AppEnv {
    AppEnv {
        ADMIN_ADDRESS: get_env_as_option("ADMIN_ADDRESS"),
        SHOW_TERMINAL: get_env_as_option("SHOW_TERMINAL"),
        ENABLE_QA_MODE: get_env_as_option("ENABLE_QA_MODE"),
    }
}

#[tauri::command]
pub async fn owns_mixnode(state: tauri::State<'_, WalletState>) -> Result<bool, BackendError> {
    Ok(nyxd_client!(state)
        .get_owned_mixnode(&nyxd_client!(state).address())
        .await?
        .mixnode_details
        .is_some())
}

#[tauri::command]
pub async fn owns_gateway(state: tauri::State<'_, WalletState>) -> Result<bool, BackendError> {
    Ok(nyxd_client!(state)
        .get_owned_gateway(&nyxd_client!(state).address())
        .await?
        .gateway
        .is_some())
}

#[tauri::command]
pub async fn try_convert_pubkey_to_mix_id(
    state: tauri::State<'_, WalletState>,
    mix_identity: IdentityKey,
) -> Result<Option<MixId>, BackendError> {
    let res = nyxd_client!(state)
        .get_mixnode_details_by_identity(mix_identity)
        .await?;
    Ok(res
        .mixnode_details
        .map(|mixnode_details| mixnode_details.mix_id()))
}

#[tauri::command]
pub async fn default_mixnode_cost_params(
    state: tauri::State<'_, WalletState>,
    profit_margin_percent: Percent,
) -> Result<MixNodeCostParams, BackendError> {
    // attaches the old pre-update default operating cost of 40 nym per interval
    let guard = state.read().await;

    // since this is only a temporary solution until users are required to provide their own cost
    // params, we can make the assumption that it's always safe to use the mix denom here
    let current_network = guard.current_network();
    let denom = current_network.mix_denom().display;

    Ok(MixNodeCostParams {
        profit_margin_percent,
        interval_operating_cost: DecCoin {
            denom: denom.into(),
            amount: Decimal::from_atomics(40u32, 0).unwrap(),
        },
    })
}
