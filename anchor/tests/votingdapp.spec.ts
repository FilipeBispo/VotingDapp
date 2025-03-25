import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Voting} from '../target/types/voting'
import { startAnchor, BankrunProvider } from 'anchor-bankrun'
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils'

const IDL = require('../target/idl/voting.json')

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('Voting', () => {

  let context;
  let provider;
  let votingProgram: Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "voting", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

    votingProgram.programId
  })

  it('Initialize Poll', async () => {
    context = await startAnchor("", [{name: "voting", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite colour",
      new anchor.BN(0),
      new anchor.BN(1839643935),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le',8)],
      votingAddress
    )
    
    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite colour");
    expect(poll.startTime.toNumber()).toBeLessThan(poll.stopTime.toNumber());

  }, 60000);
  

  
  it("initialized candidate", async() => {
    await votingProgram.methods.initializeCandidate(
      "Filipe",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Bispo",
      new anchor.BN(1),
    ).rpc();

    const [bispoAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Bispo")],
      votingAddress,
    );

    const bispoCandidate = await votingProgram.account.candidate.fetch(bispoAddress);
    console.log(bispoCandidate);

    expect()

    const [filipeAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Filipe")],
      votingAddress,
    );

    const filipeCandidate = await votingProgram.account.candidate.fetch(filipeAddress);
    console.log(filipeCandidate);
  });

  it("vote", async() => {

  });
});

