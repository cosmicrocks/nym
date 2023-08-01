use nym_sdk::mixnet::{
    AnonymousSenderTag, MixnetClientBuilder, ReconstructedMessage, StoragePaths,
};
use std::path::PathBuf;

#[tokio::main]
async fn main() {
    nym_bin_common::logging::setup_logging();

    // Specify some config options
    let config_dir = PathBuf::from("/tmp/surb-example");
    let storage_paths = StoragePaths::new_from_dir(&config_dir).unwrap();

    // Create the client with a storage backend, and enable it by giving it some paths. If keys
    // exists at these paths, they will be loaded, otherwise they will be generated.
    let client = MixnetClientBuilder::new_with_default_storage(storage_paths)
        .await
        .unwrap()
        .build()
        .await
        .unwrap();

    // Now we connect to the mixnet, using keys now stored in the paths provided.
    let mut client = client.connect_to_mixnet().await.unwrap();

    // Be able to get our client address
    let our_address = client.nym_address();
    println!("\nOur client nym address is: {our_address}");

    // Send a message through the mixnet to ourselves using our nym address
    client.send_str(*our_address, "hello there").await;

    // we're going to parse the sender_tag (AnonymousSenderTag) from the incoming message and use it to 'reply' to ourselves instead of our Nym address.
    // we know there will be a sender_tag since the sdk sends SURBs along with messages by default.
    println!("Waiting for message\n");

    // get the actual message - discard the empty vec sent along with a potential SURB topup request
    let mut message: Vec<ReconstructedMessage> = Vec::new();
    while let Some(new_message) = client.wait_for_messages().await {
        if new_message.is_empty() {
            continue;
        }
        message = new_message;
        break;
    }

    let mut parsed = String::new();
    if let Some(r) = message.first() {
        parsed = String::from_utf8(r.message.clone()).unwrap();
    }
    // parse sender_tag: we will use this to reply to sender without needing their Nym address
    let return_recipient: AnonymousSenderTag = message[0].sender_tag.unwrap();
    println!(
        "\nReceived the following message: {} \nfrom sender with surb bucket {}",
        parsed, return_recipient
    );

    // reply to self with it: note we use `send_str_reply` instead of `send_str`
    println!("Replying with using SURBs");
    client.send_str_reply(return_recipient, "hi an0n!").await;

    println!("Waiting for message (once you see it, ctrl-c to exit)\n");
    client
        .on_messages(|msg| println!("\nReceived: {}", String::from_utf8_lossy(&msg.message)))
        .await;
}
