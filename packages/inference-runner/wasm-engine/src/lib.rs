use wasm_bindgen::prelude::*;

// We'll store model data in a static mut, for demonstration only (not thread-safe).
static mut MODEL_WEIGHTS: Option<&'static [u8]> = None;
static mut MODEL_LOADED: bool = false;

/// # Safety
/// The pointer + length must point to valid memory in WASM's linear memory.
#[no_mangle]
pub unsafe extern "C" fn load_model(ptr: *const u8, len: usize) {
    if ptr.is_null() || len == 0 {
        // In a real scenario, handle errors more gracefully
        MODEL_LOADED = false;
        return;
    }
    // Convert pointer to a slice in WASM memory
    let slice = core::slice::from_raw_parts(ptr, len);
    MODEL_WEIGHTS = Some(slice);
    MODEL_LOADED = true;
}

/// # Safety
/// This is a dummy function simulating "run inference".
/// In real code, you'd parse the input tokens from memory, run them
/// through the loaded model, and write back output tokens.
#[no_mangle]
pub unsafe extern "C" fn run_inference(
    input_ptr: *const u32,
    input_len: usize,
    output_ptr: *mut u32,
    output_len: usize,
) {
    if !MODEL_LOADED {
        // For demonstration, do nothing or set a special output
        return;
    }

    if input_ptr.is_null() || output_ptr.is_null() {
        return;
    }

    // We'll do a trivial "echo" to show the mechanics.
    let input_slice = core::slice::from_raw_parts(input_ptr, input_len);
    let output_slice = core::slice::from_raw_parts_mut(output_ptr, output_len);

    let count = core::cmp::min(input_len, output_len);
    // Copy input tokens to output tokens
    for i in 0..count {
        output_slice[i] = input_slice[i];
    }
}
